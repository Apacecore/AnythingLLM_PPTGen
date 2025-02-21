# 📌 AnythingLLM_PPTGen
An open-source tool that integrates **AnythingLLM** and **pptgenjs** to generate and execute PowerPoint diagrams.

https://github.com/user-attachments/assets/b7d115a8-765b-4300-ba31-f35dfd29e16a

---
## 🚀 Library Access Limitation

This repository is integrated with **AnythingLLM**, but users can only access the preloaded library of text files. The available documents include:

### **AI & Chip Design**
- `AI_system_basic.txt`
- `CNN_chip.txt`
- `chip_design_flow.txt`
- `IC_design_flow.txt`
- `IC_design_flow(digital&analog).txt`
- `FPGA_Avalon_System_Presentation.txt`
- `AR_glasses_inference_chip.txt`
- `AR_glasses_inference_fpga.txt`
- `HM0361_image_sensor.txt`

### **LCD & Display Technology**
- `LCD.txt`
- `LCD_Controller.txt`
- `LCD_Display.txt`
- `LCD_Board_and_LCD_Module.txt`
- `LCD_panel_with_RGB_interface.txt`
- `TFT-LCD driver system.txt`

### **EEG & BCI Control**
- `EEG_BCI_Control.txt`
- `EEG_BCI_Robot_Control.txt`
- `SSVEP_Control_Flowchart.txt`

📌 **Users cannot upload or modify additional documents within the system. Only these preloaded files will be accessible for reference.**



## 🚀 Features
✅ **AI-Generated Diagrams** – Uses AnythingLLM to create `pptgenjs` code based on user queries.  
✅ **Automated PowerPoint Generation** – Converts generated `pptgenjs` into `.pptx` files.  
✅ **Supports PPT to SVG Conversion** – Easily convert PowerPoint slides to SVG.  
✅ **Interactive Web Interface** – Provides a UI for diagram generation and visualization.  
✅ **Docker Support (Optional)** – Run the entire system with Docker for external access.  

---

## 🛠️ Installation
### 1️⃣ Local Setup (For Internal Users)
**Pre-requisites:**
- **Node.js (v18+)**
- **AnythingLLM running on `http://192.168.1.38:3000`**
- **OpenAI API Key and AnythingLLM API Key** (must be provided by the user)

#### Step 1: Clone the Repository
```sh
git clone https://github.com/Apacecore/AnythingLLM_PPTGen.git
cd AnythingLLM_PPTGen
```

#### Step 2: Configure API Keys
Create a `.env` file in the root directory and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
ANYTHINGLLM_API_KEY=your_anythingllm_api_key_here
```

#### Step 3: Install Dependencies
```sh
npm install
```

#### Step 4: Run the Server
```sh
node server.js
```
- Open **[http://localhost:3002/](http://localhost:3002/)** in your browser.
- **Diagram Generator** → Enter queries and receive `pptgenjs` code.
- **SVG Preview** → View converted diagrams.
- Download the **PowerPoint file**.

#### Step 5: Generate and Run PPT Code
1. Open **AnythingLLM** (`http://192.168.1.38:3000`).
2. Type a query (e.g., `"Generate a block diagram for an AI system"`).
3. Copy the generated `pptgenjs` code.
4. Paste it into `tempPPTGen.js` and run:
   ```sh
   node tempPPTGen.js
   ```
5. The **PowerPoint file** will be generated and saved.

---

### 2️⃣ Docker Setup (For External Users)
**Pre-requisites:**
- **Docker installed** ([Download Here](https://www.docker.com/get-started))
- **OpenAI API Key and AnythingLLM API Key** (must be provided by the user)

#### Step 1: Clone the Repository
```sh
git clone https://github.com/Apacecore/AnythingLLM_PPTGen.git
cd AnythingLLM_PPTGen
```

#### Step 2: Configure API Keys
Create a `.env` file in the root directory and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
ANYTHINGLLM_API_KEY=your_anythingllm_api_key_here
```

#### Step 3: Build and Run with Docker
```sh
docker build -t anythingllm_pptgen .
docker run -p 3001:3000 anythingllm_pptgen
```

#### Step 4: Access the App
- Open **[http://localhost:3001](http://localhost:3001)** in your browser.
- Open **[http://localhost:3002](http://localhost:3002)** for the diagram generator and SVG preview.

#### Step 5: Generate PPT from AnythingLLM
1. Open `http://localhost:3001` and type a query.
2. Copy the `pptgenjs` code.
3. Use `http://localhost:3002` to process and visualize it.

---

## 📂 Project Structure
```
📁 AnythingLLM_PPTGen
 ├─📁 node_modules        # Node.js dependencies (not committed)
 ├─📁 public              # Static files (if needed)
 ├─📁 svg_output          # SVG-converted files
 ├─📄 server.js           # Main backend server
 ├─📄 tempPPTGen.js       # Runs pptgenjs code
 ├─📄 ppt_to_svg.py       # Converts PPT to SVG
 ├─📄 Dockerfile          # Docker build configuration
 ├─📄 docker-compose.yml  # Docker Compose setup
 ├─📄 package.json        # Node.js dependencies
 ├─📄 package-lock.json   # Dependency lockfile
 ├─📄 .env                # Environment variables (not committed)
 ├─📄 README.md           # Project documentation
 ├─📄 LICENSE             # MIT License
```

---

## 📜 License
This project is licensed under the **MIT License**. Feel free to modify and contribute!  

---

## 📢 Contributing
- Fork the repo and make a pull request!  
- Open an issue for feature requests or bug reports.  

📧 **For any questions, contact the team!** 🚀

