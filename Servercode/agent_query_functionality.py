# # # The quickest way to get started is with an existing agent (or agents) and wrapping into launcher.

# # # The example below shows a trivial example with two agents from llama-index.

# # # First, lets setup some agents and initial components for our llama-agents system:

# # from llama_agents import (
# #     AgentService,
# #     AgentOrchestrator,
# #     ControlPlaneServer,
# #     SimpleMessageQueue,
# # )

# # from llama_index.core.agent import ReActAgent
# # from llama_index.core.tools import FunctionTool
# # from llama_index.llms.openai import OpenAI


# # # create an agent
# # def get_the_secret_fact() -> str:
# #     """Returns the secret fact."""
# #     return "The secret fact is: A baby llama is called a 'Cria'."


# # tool = FunctionTool.from_defaults(fn=get_the_secret_fact)

# # agent1 = ReActAgent.from_tools([tool], llm=OpenAI())
# # agent2 = ReActAgent.from_tools([], llm=OpenAI())

# # # create our multi-agent framework components
# # message_queue = SimpleMessageQueue(port=8000)
# # control_plane = ControlPlaneServer(
# #     message_queue=message_queue,
# #     orchestrator=AgentOrchestrator(llm=OpenAI(model="gpt-4-turbo")),
# #     port=8001,
# # )
# # agent_server_1 = AgentService(
# #     agent=agent1,
# #     message_queue=message_queue,
# #     description="Useful for getting the secret fact.",
# #     service_name="secret_fact_agent",
# #     port=8002,
# # )
# # agent_server_2 = AgentService(
# #     agent=agent2,
# #     message_queue=message_queue,
# #     description="Useful for getting random dumb facts.",
# #     service_name="dumb_fact_agent",
# #     port=8003,
# # )

# # # Local / Notebook Flow

# # # Next, when working in a notebook or for faster iteration, we can launch our llama-agents system in a single-run setting, where one message is propagated through the network and returned.



# # from llama_agents import LocalLauncher

# # # launch it
# # launcher = LocalLauncher(
# #     [agent_server_1, agent_server_2],
# #     control_plane,
# #     message_queue,
# # )
# # result = launcher.launch_single("What is the secret fact?")

# # print(f"Result: {result}")


# # # As with any agentic system, its important to consider how reliable the LLM is that you are using. In general, APIs that support function calling (OpenAI, Anthropic, Mistral, etc.) are the most reliable.

# # # Server Flow

# # # Once you are happy with your system, we can launch all our services as independent processes, allowing for higher throughput and scalability.

# # # By default, all task results are published to a specific "human" queue, so we also define a consumer to handle this result as it comes in. (In the future, this final queue will be configurable!)

# # # To test this, you can use the server launcher in a script:


# # from llama_agents import ServerLauncher, CallableMessageConsumer


# # # Additional human consumer
# # def handle_result(message) -> None:
# #     print(f"Got result:", message.data)


# # human_consumer = CallableMessageConsumer(
# #     handler=handle_result, message_type="human"
# # )

# # # Define Launcher
# # launcher = ServerLauncher(
# #     [agent_server_1, agent_server_2],
# #     control_plane,
# #     message_queue,
# #     additional_consumers=[human_consumer],
# # )

# # # Launch it!
# # launcher.launch_servers()

# # # Now, since everything is a server, you need API requests to interact with it. The easiest way is to use our client and the control plane URL:

# # from llama_agents import LlamaAgentsClient, AsyncLlamaAgentsClient

# # client = LlamaAgentsClient("<control plane URL>")  # i.e. http://127.0.0.1:8001
# # task_id = client.create_task("What is the secret fact?")
# # # <Wait a few seconds>
# # # returns TaskResult or None if not finished
# # result = client.get_task_result(task_id)

# # # Rather than using a client or raw curl requests, you can also use a built-in CLI tool to monitor and interact with your services.

# # # In another terminal, you can run:

# # #llama-agents monitor --control-plane-url http://127.0.0.1:8000



# from llama_agents import (
#     AgentService,
#     AgentOrchestrator,
#     ControlPlaneServer,
#     SimpleMessageQueue,
# )

# from llama_index.core.agent import ReActAgent
# from llama_index.core.tools import FunctionTool
# from llama_index.llms.openai import OpenAI


# # create an agent
# def get_the_secret_fact() -> str:
#     """Returns the secret fact."""
#     return "The secret fact is: A baby llama is called a 'Cria'."


# tool = FunctionTool.from_defaults(fn=get_the_secret_fact)

# agent1 = ReActAgent.from_tools([tool], llm=OpenAI())
# agent2 = ReActAgent.from_tools([], llm=OpenAI())

# # create our multi-agent framework components
# message_queue = SimpleMessageQueue(port=8000)
# control_plane = ControlPlaneServer(
#     message_queue=message_queue,
#     orchestrator=AgentOrchestrator(llm=OpenAI(model="gpt-4-turbo")),
#     port=8001,
# )
# agent_server_1 = AgentService(
#     agent=agent1,
#     message_queue=message_queue,
#     description="Useful for getting the secret fact.",
#     service_name="secret_fact_agent",
#     port=8002,
# )
# agent_server_2 = AgentService(
#     agent=agent2,
#     message_queue=message_queue,
#     description="Useful for getting random dumb facts.",
#     service_name="dumb_fact_agent",
#     port=8003,
# )

# # Local / Notebook Flow

# # Next, when working in a notebook or for faster iteration, we can launch our llama-agents system in a single-run setting, where one message is propagated through the network and returned.



# from llama_agents import LocalLauncher

# # launch it
# launcher = LocalLauncher(
#     [agent_server_1, agent_server_2],
#     control_plane,
#     message_queue,
# )
# result = launcher.launch_single("What is the secret fact?")

# print(f"Result: {result}"





# ----------------------------------------------------------------------------------------------------------------------------------------------------------------

# from llama_agents import (
#     AgentService,
#     HumanService,
#     AgentOrchestrator,
#     CallableMessageConsumer,
#     ControlPlaneServer,
#     ServerLauncher,
#     SimpleMessageQueue,
#     QueueMessage,
# )

# from llama_index.core.agent import FunctionCallingAgentWorker
# from llama_index.core.tools import FunctionTool
# from llama_index.llms.openai import OpenAI


# datascience_tool = FunctionTool.from_defaults(fn=analyze)
# #vectorDB_tool = FunctionTool.from_defaults(fn= ? )
# #web_tool = FuntionTool.from_defaults(fn=?)

# if query_desicion() == 1:
#     datascience_agent1 = FunctionCallingAgentWorker.from_tools([datascience_tool], llm=OpenAI())
#     agent1 = datascience_agent1.as_agent()
# elif query_desicion() == 2:
#     #implement functionality :  information that can be retrieved from financial documents
#     retreval_agent2 = FunctionCallingAgentWorker.from_tools([], llm=OpenAI())
#     agent2 = retreval_agent2.as_agent()
# else :
#     web_agent3 = FunctionCallingAgentWorker.from_tools([], llm=OpenAI())
#     agent3 = web_agent3.as_agent()


# # create our multi-agent framework components
# message_queue = SimpleMessageQueue()
# queue_client = message_queue.client

# control_plane = ControlPlaneServer(
#     message_queue=queue_client,
#     orchestrator=AgentOrchestrator(llm=OpenAI()),
# )
# agent_server_1 = AgentService(
#     agent=agent1,
#     message_queue=queue_client,
#     description="agent used to process data science query",
#     service_name=" data science agent",
#     host="127.0.0.1",
#     port=8002,
# )
# agent_server_2 = AgentService(
#     agent=agent2,
#     message_queue=queue_client,
#     description=" vector retrival from Silo of company documents",
#     service_name="company analysis agent ",
#     host="127.0.0.1",
#     port=8003,
# )
# agent_server_3 = AgentService(
#     agent = agent3,
#     message_queue=queue_client,
#     description=" useful for extracting company information from web ",
#     host="127.0.0.1",
#     port=8004,
# )

# # launch it
# launcher = ServerLauncher(
#     [agent_server_1, agent_server_2, agent_server_3],
#     control_plane,
#     message_queue,
# )

# launcher.launch_servers()


