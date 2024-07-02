import dotenv
dotenv.load_dotenv() # our .env defines OPENAI_API_KEY
from llama_index.core import VectorStoreIndex, Document
from llama_index.core.agent import FnAgentWorker
from llama_index.core import PromptTemplate
from llama_index.core.query_pipeline import QueryPipeline
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_agents import (
    AgentService,
    ControlPlaneServer,
    SimpleMessageQueue,
    PipelineOrchestrator,
    ServiceComponent,
)
from llama_agents.launchers import LocalLauncher
from llama_index.llms.openai import OpenAI
import logging

# change logging level to enable or disable more verbose logging
logging.getLogger("llama_agents").setLevel(logging.INFO)

# Load and index your document
docs = [Document(text="The rabbit is a small mammal with long ears and a fluffy tail. His name is Peter.")]
index = VectorStoreIndex.from_documents(docs)

# Define a query rewrite agent
HYDE_PROMPT_STR = (
    "Please rewrite the following query to include more detail:\n{query_str}\n"
)
HYDE_PROMPT_TMPL = PromptTemplate(HYDE_PROMPT_STR)

def run_hyde_fn(state):
    prompt_tmpl, llm, input_str = (
        state["prompt_tmpl"],
        state["llm"],
        state["__task__"].input,
    )
    qp = QueryPipeline(chain=[prompt_tmpl, llm])
    output = qp.run(query_str=input_str)
    state["__output__"] = str(output)
    return state, True

hyde_agent = FnAgentWorker(
    fn=run_hyde_fn,
    initial_state={"prompt_tmpl": HYDE_PROMPT_TMPL, "llm": OpenAI()}
).as_agent()

# Define a RAG agent
def run_rag_fn(state):
    retriever, llm, input_str = (
        state["retriever"],
        state["llm"],
        state["__task__"].input,
    )
    query_engine = RetrieverQueryEngine.from_args(retriever, llm=llm)
    response = query_engine.query(input_str)
    state["__output__"] = str(response)
    return state, True

rag_agent = FnAgentWorker(
    fn=run_rag_fn,
    initial_state={"retriever": index.as_retriever(), "llm": OpenAI()}
).as_agent()

# Set up the multi-agent system
message_queue = SimpleMessageQueue()

query_rewrite_service = AgentService(
    agent=hyde_agent,
    message_queue=message_queue,
    description="Query rewriting service",
    service_name="query_rewrite",
)

rag_service = AgentService(
    agent=rag_agent,
    message_queue=message_queue,
    description="RAG service",
    service_name="rag",
)

# Create the pipeline
pipeline = QueryPipeline(chain=[
    ServiceComponent.from_service_definition(query_rewrite_service),
    ServiceComponent.from_service_definition(rag_service),
])
orchestrator = PipelineOrchestrator(pipeline)

control_plane = ControlPlaneServer(
    message_queue=message_queue,
    orchestrator=orchestrator,
)

# Set up the launcher
launcher = LocalLauncher(
    [query_rewrite_service, rag_service],
    control_plane,
    message_queue,
)

# Run a query
result = launcher.launch_single("Tell me about rabbits")
print(result)