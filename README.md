"# NyaaySaathi-" 
# NYAYSAATHI

## Project Description

NYAYSAATHI is an AI-powered virtual legal assistant designed to provide women in India with quick and easy access to information and support regarding their legal rights.  This project leverages the Twilio API for WhatsApp integration, enabling users to interact with the Rasa conversational AI platform directly through WhatsApp.  This aims to increase accessibility and ease of use, particularly for users who may prefer using WhatsApp over other platforms.

## Features

* **Chatbot Interaction:** Users can interact with the chatbot to ask legal questions and receive instant responses.
* **Knowledge Base:** The chatbot is trained on a comprehensive legal knowledge base, focusing on women's legal rights in India.
* **User-Friendly Interface:** The React frontend provides a clean and intuitive user experience.
* **Scalable Architecture:** The Node.js backend is designed to be scalable and maintainable.
* **WhatsApp Integration:** Users can access the legal assistant directly through WhatsApp, thanks to Twilio integration.
* **Voice Message Support:** Users can send voice messages, which are transcribed and processed by the chatbot.

## Technologies Used

* **Frontend:** React
* **Backend:** Node.js, Express.js
* **Chatbot:** Rasa
* **Other:** Twilio (for WhatsApp integration), FFmpeg (for audio conversion)

## Installation

### Prerequisites

* Node.js
* npm or yarn
* Python (for Rasa)
* Rasa CLI
* (Optionally) A database (e.g., PostgreSQL, MongoDB)
* FFmpeg

### Backend Setup

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:

    * Create a `.env` file in the `backend` directory.
    * Add the following variables, replacing the values with your actual credentials:

        ```
        PORT=5000
        TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        TWILIO_AUTH_TOKEN=your_auth_token
        WIT_AI_KEY=YOUR_WIT_AI_KEY
        # Add any other necessary environment variables
        ```

4.  Start the backend server:

    ```bash
    npm run start
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the frontend development server:

    ```bash
    npm run dev
    ```

### Rasa Chatbot Setup

1.  Navigate to the `rasa_bot` directory:

    ```bash
    cd rasa_bot
    ```

2.  (Optional) Create a virtual environment (recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate # On Linux/macOS
    venv\Scripts\activate.bat # On Windows
    ```

3.  Install Rasa dependencies:

    ```bash
    pip install -r requirements.txt # If you have a requirements.txt
    pip install rasa # If not
    ```

4.  Train the Rasa model:

    ```bash
    rasa train
    ```

5.  Start the Rasa server:

    ```bash
    rasa run --enable-api -p 5005
    ```

##  Running the Application

1.  Ensure that the backend server, frontend development server, and Rasa server are all running.
2.  Open your browser and navigate to the address where the frontend is served (usually `http://localhost:5173`).
3.  Start interacting with the chatbot.

##  File Structure

NYAYSAATHI/├── backend/│   ├── controllers/│   ├── routes/│   ├── server.js│   ├── package.json│   └── ...├── frontend/│   ├── public/│   ├── src/│   ├── index.html│   ├── package.json│   └── ...├── rasa_bot/│   ├── actions/│   ├── data/│   ├── models/│   ├── config.yml│   ├── domain.yml│   └── ...├── .gitignore└── README.md
##  Contributing

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes.
4.  Push your changes to your fork.
5.  Submit a pull request.

##  License

[Specify the license, e.g., MIT, Apache 2.0]

##  Contact

[Trisha U]
[trishaumesh29@gmail.com]
