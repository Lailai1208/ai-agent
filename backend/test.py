import dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA
# from langchain_nvidia_ai_endpoints import 

dotenv.load_dotenv()
import os

# tool_models = [model for model in ChatNVIDIA.get_available_models() if model.supports_tools]
# print(tool_models)

API = os.getenv("NIM_DEEPSEEK_R1_API")

llm = ChatNVIDIA(
  model="deepseek-ai/deepseek-r1",
  api_key=API, 
  temperature=0.6,
  top_p=0.7,
  max_tokens=4096,
)

for chunk in llm.stream("Intro"):
    # Show the token separations
    print(chunk.content, end="")


# # response = llm.invoke([{"role":"user","content":"Introduce yourself"}])
# # print(response.content)

