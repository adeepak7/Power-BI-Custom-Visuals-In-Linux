//DataViewObjects provides functions in order to extract values of the objects.
import DataViewObjects = powerbi.extensibility.utils.dataview.DataViewObjects;
import FilterAction = powerbi.FilterAction;
import FilterManager = powerbi.extensibility.utils.filter.FilterManager;

//Contains JavaScript & TypeScript object models for Microsoft Power BI JavaScript SDK
//An object model helps describe or define a software/system in terms of objects and classes. It defines the interfaces or interactions between different models, inheritance, encapsulation and other object-oriented interfaces and features.
//
// Object model examples include:
// Document Object Model (DOM): A set of objects that provides a modeled representation of dynamic HTML and XHTML-based Web pages
// Component Object Model (COM): A proprietary Microsoft software architecture used to create software components
const models: any = window["powerbi-models"];
module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private searchBox: HTMLInputElement[] = [];
        private searchButton: HTMLButtonElement[] = [];
        private clearButton: HTMLButtonElement[] = [];
        private column: powerbi.DataViewMetadataColumn;
        private host: powerbi.extensibility.visual.IVisualHost;


        constructor (options: VisualConstructorOptions) {
            this.target = options.element;
            this.target.innerHTML = `
            <div>
                <div class="text-filter-search" id="1">
                    <label class = "searchbox-key"> Key </label>
                    <label class = "colon" style="display: inline-block"> : </label>
	                <input aria-label="Enter your search" type="text" placeholder="Search" name="search-field">
                    <button class="c-glyph search-button" style="display: inline-block" name="search-button"></button>
                    <button class="c-glyph clear-button" style="display: inline-block" name="clear-button"></button>
                </div>
                 </div id="2">
                    <br/>
                 <div>
                <div class="text-filter-search" id="3">
                    <label class = "searchbox-key"> Key </label>
                    <label class = "colon" style="display: inline-block"> : </label>
	                <input aria-label="Enter your search" type="text" placeholder="Search" name="search-field-2">
                    <button class="c-glyph search-button" style="display: inline-block" name="search-button-2"></button>
                    <button class="c-glyph clear-button" style="display: inline-block" name="clear-button-2"></button>
                </div>
             </div>
            `;

            // Custom line to access the DOM nodes.
                //console.log(this.target.firstElementChild.firstElementChild.querySelectorAll("button")[1]);


            //First search model
            this.searchBox[0] = this.target.firstElementChild.firstElementChild.querySelector("input") as HTMLInputElement;
            this.searchBox[0].addEventListener("keydown", (e) => {
              if (e.keyCode == 13) {
                this.performSearch(this.searchBox[0].value.toString());
              }
            });

            console.log("Search : " + "");

            this.searchButton[0] = this.target.firstElementChild.firstElementChild.querySelectorAll("button")[0] as HTMLButtonElement;
            this.searchButton[0].addEventListener("click", () => this.performSearch(this.searchBox[0].value.toString()));
            this.clearButton[0] = this.target.firstElementChild.firstElementChild.querySelectorAll("button")[1] as HTMLButtonElement;
            this.clearButton[0].addEventListener("click", () => this.performSearch(''.toString()));



            // Custom line to access the DOM nodes.
                console.log(this.target.lastElementChild.lastElementChild);

            //Second search model
            this.searchBox[1] = this.target.lastElementChild.lastElementChild.querySelector("input") as HTMLInputElement;
            this.searchBox[1].addEventListener("keydown", (e) => {
                if (e.keyCode == 13) {
                    this.performSearch2(this.searchBox[1].value.toString());
                }
            });
            this.searchButton[1] = this.target.lastElementChild.lastElementChild.querySelectorAll("button")[0] as HTMLButtonElement;
            this.searchButton[1].addEventListener("click", () => this.performSearch2(this.searchBox[1].value.toString()));
            this.clearButton[1] = this.target.lastElementChild.lastElementChild.querySelectorAll("button")[1] as HTMLButtonElement;
            this.clearButton[1].addEventListener("click", () => this.performSearch2(''.toString()));

            this.host = options.host;
        }

        /** 
         * Perfom search/filtering in a column
         * @param {string} text - text to filter on
         */
        public performSearch(text: string) {


            if (this.column) {

                const isBlank = ((text || "") + "").match(/^\s*$/);

                const target = {
                    //Table name
                    table: this.column.queryName.substr(0, this.column.queryName.indexOf('.')),

                    //First field in the table which we want to apply filter on:
                    column: this.column.queryName.substr(this.column.queryName.indexOf('.') + 1)
                };

                //Checking for the name.
                console.log("Table: " + target.table  + "\nColumn: " + target.column);

                let filter: any = null;

                let action = FilterAction.merge;

                  filter = new models.AdvancedFilter(
                    target,
                    "And",
                    {
                      operator: "Contains",
                      value: text
                    }
                  );
                  action = FilterAction.merge;
                  this.searchBox[0].value = text;

                this.host.applyJsonFilter(filter, "general", "filter", action);

            }

            this.searchBox[0].value = text;
        }

        public performSearch2(text: string) {

            if (this.column) {
                const target = {
                    //Table name
                    table: this.column.queryName.substr(0, this.column.queryName.indexOf('.')),

                    //First field in the table which we want to apply filter on:
                    column: "Sales".toString()
                };

                let filter: any = null;
                let action = FilterAction.merge;

                filter = new models.AdvancedFilter(
                    target,
                    "And",
                    {
                        operator: "Contains",
                        value: text
                    }
                );
                action = FilterAction.merge;
                this.searchBox[1].value = text;

                this.host.applyJsonFilter(filter, "general", "filter", action);
            }

            this.searchBox[1].value = text;
        }

        /**
         *Check for update and perform it
         */
        public update(options: VisualUpdateOptions) {
            const metadata = options.dataViews && options.dataViews[0] && options.dataViews[0].metadata;
            const newColumn = metadata && metadata.columns && metadata.columns[0];
            console.log("New Column: " + newColumn);
            const objectCheck = metadata && metadata.objects;
            const properties = DataViewObjects.getObject(objectCheck, "general") as any || {}; 
            let searchText = "";

                // We had a column, but now it is empty, or it has changed.
            if (options.dataViews && options.dataViews.length > 0 && this.column && (!newColumn || this.column.queryName !== newColumn.queryName)) {
                  this.performSearch("");
                  this.performSearch2("");

            // Well, it hasn't changed, then lets try to load the existing search text.
            } else if (properties.filter) {
              const appliedFilter = FilterManager.restoreFilter(properties.filter) as IAdvancedFilter;
              if (appliedFilter && appliedFilter.conditions && appliedFilter.conditions.length === 1) {
                searchText = (appliedFilter.conditions[0].value || "") + "";
              }
            }

            //this.searchBox[0].value = searchText;
            //this.searchBox[1].value = searchText;
            this.column = newColumn;
        }
    }
}