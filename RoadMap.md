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
  - Browser application compatible with the certificate importer provided by the underlying platform.
    - In this case, I will be using `Chromium browser` for UBUNTU.

### Getting started: 
