# Setting up the environment
## Platform: UBUNTU 18.04.1 LTS
### Prerequisites:
  - Node JS environment. Download and Install [Node JS](https://nodejs.org/)
  - Intall or check for the latest version of npm.
    - You might face npm errors in future: "write after end".
      - Solution: Execute the following commands:
        - `npm install -g npm@latest`
        - `npm cache verify`
        - `npm i`
  - To access your visual through PowerBI, you need to add a trusted certificate for localhost. This will allow PowerBI to         load the visual assets in your browser without a security warning.
    - Install [openssl](https://www.openssl.org/)
    - Execute the following commands:
      - `sudo apt-get install openssl`
  - Browser application compatible with the certificate importer provided by the underlying platform.
    - In this case, I will be using `Chromium browser` for UBUNTU.

### Getting started: 
  - Install the Command Line Tools by executing the following coomand:
    - `npm install -g powerbi-visuals-tools`
  - To confirm it was installed correctly you can run the command without any parameters which should display the help screen.
    - `pbiviz`
  - Create a new project by:
    - `pbiviz new <project_name>`
  - Start the project:
    - `pbiviz start`
    - You will see a Visual Server has started listening to the client at **port = 8080**
  - Go to [Power BI Online](https://powerbi.microsoft.com/en-us/landing/signin/) and **Enable the Developer Mode**
  - Load your visual, and you are ready to go...
