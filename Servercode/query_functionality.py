# The quickest way to get started is with an existing agent (or agents) and wrapping into launcher.

# The example below shows a trivial example with two agents from llama-index.

# First, lets setup some agents and initial components for our llama-agents system:

from llama_agents import (
    AgentService,
    AgentOrchestrator,
    ControlPlaneServer,
    SimpleMessageQueue,
)

from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI


# create an agent
def get_the_secret_fact() -> str:
    """Returns the secret fact."""
    return "The secret fact is: A baby llama is called a 'Cria'."


tool = FunctionTool.from_defaults(fn=get_the_secret_fact)

agent1 = ReActAgent.from_tools([tool], llm=OpenAI())
agent2 = ReActAgent.from_tools([], llm=OpenAI())

# create our multi-agent framework components
message_queue = SimpleMessageQueue(port=8000)
control_plane = ControlPlaneServer(
    message_queue=message_queue,
    orchestrator=AgentOrchestrator(llm=OpenAI(model="gpt-4-turbo")),
    port=8001,
)
agent_server_1 = AgentService(
    agent=agent1,
    message_queue=message_queue,
    description="Useful for getting the secret fact.",
    service_name="secret_fact_agent",
    port=8002,
)
agent_server_2 = AgentService(
    agent=agent2,
    message_queue=message_queue,
    description="Useful for getting random dumb facts.",
    service_name="dumb_fact_agent",
    port=8003,
)

# Local / Notebook Flow

# Next, when working in a notebook or for faster iteration, we can launch our llama-agents system in a single-run setting, where one message is propagated through the network and returned.



from llama_agents import LocalLauncher

# launch it
launcher = LocalLauncher(
    [agent_server_1, agent_server_2],
    control_plane,
    message_queue,
)
result = launcher.launch_single("What is the secret fact?")

print(f"Result: {result}")


# As with any agentic system, its important to consider how reliable the LLM is that you are using. In general, APIs that support function calling (OpenAI, Anthropic, Mistral, etc.) are the most reliable.

# Server Flow

# Once you are happy with your system, we can launch all our services as independent processes, allowing for higher throughput and scalability.

# By default, all task results are published to a specific "human" queue, so we also define a consumer to handle this result as it comes in. (In the future, this final queue will be configurable!)

# To test this, you can use the server launcher in a script:


from llama_agents import ServerLauncher, CallableMessageConsumer


# Additional human consumer
def handle_result(message) -> None:
    print(f"Got result:", message.data)


human_consumer = CallableMessageConsumer(
    handler=handle_result, message_type="human"
)

# Define Launcher
launcher = ServerLauncher(
    [agent_server_1, agent_server_2],
    control_plane,
    message_queue,
    additional_consumers=[human_consumer],
)

# Launch it!
launcher.launch_servers()

# Now, since everything is a server, you need API requests to interact with it. The easiest way is to use our client and the control plane URL:

from llama_agents import LlamaAgentsClient, AsyncLlamaAgentsClient

client = LlamaAgentsClient("<control plane URL>")  # i.e. http://127.0.0.1:8001
task_id = client.create_task("What is the secret fact?")
# <Wait a few seconds>
# returns TaskResult or None if not finished
result = client.get_task_result(task_id)

# Rather than using a client or raw curl requests, you can also use a built-in CLI tool to monitor and interact with your services.

# In another terminal, you can run:

#llama-agents monitor --control-plane-url http://127.0.0.1:8000
