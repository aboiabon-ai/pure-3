import streamlit as st
import google.generativeai as genai

# Konfigurasi Halaman
st.set_page_config(page_title="My AI Agent", layout="centered")
st.title("🤖 Personal AI Assistant")

# Koneksi ke Gemini API
# Kita akan mengatur API_KEY di tahap hosting nanti demi keamanan
api_key = st.secrets["GEMINI_API_KEY"]
genai.configure(api_key=api_key)

# Input System Instruction (Hasil dari NotebookLM/AI Studio Anda)
instruction = "Tuliskan instruksi agent Anda di sini..."

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=instruction
)

# Chat Interface
if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Tanya sesuatu..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    response = model.generate_content(prompt)
    with st.chat_message("assistant"):
        st.markdown(response.text)
    st.session_state.messages.append({"role": "assistant", "content": response.text})
