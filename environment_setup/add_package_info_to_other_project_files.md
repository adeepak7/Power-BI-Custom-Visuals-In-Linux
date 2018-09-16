# The file contains the steps to add dependencies to other project files.

### The steps are in order as the packages in the table in required_packages.md file.
  
  - **D3*
    - **File**: pbiviz.json
    - **JSON key**: externalJS, **JSON value**: ["node_modules/d3/d3.js"]
  - **types**
    - **File**: tsconfig.json
    - **JSON key**: typeRoots, **JSON value**: [./node_modules/@types]
      
