/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";

    /*let staticData = [
            {
                value: 10,
                category: 'China'
            },
            {
                value: 12,
                category: 'USA'
            },
            {
              value: 11,
              category: 'India'
            },
            {
                value: 13,
                category: 'UK'
            }
        ];
        */

    function visualTransform(options: VisualUpdateOptions, host: IVisualHost){
        // Ivisualhost is the interface provided by Power BI tools to call the
        // right methods internally.
        let dataViews = options.dataViews; // dataviews gives the access to the data entered by the user.

        //Creating a new object to hold the relevant information about the data
        let dataInfo = {
            dataPoints: [],
            dataMax: 0
        };

        //Conditional check for data:
        if(    !dataViews
            || !dataViews[0]
            || !dataViews[0].categorical // Check if categorical property/mapping for data and in capabalities.ts exists or not.
            || !dataViews[0].categorical.categories // Check is the data actually contain category
            || !dataViews[0].categorical.categories[0].source //source is provided by Power BI, which holds metadata about our source data.
            || !dataViews[0].categorical.values
        ){ // Check if data is present.
            return dataInfo;
        }

        let categorical = dataViews[0].categorical;
        let category = categorical.categories[0];
        let dataValue = categorical.values[0];

        let dataPoints = [];
        let dataMax: number;

        for(let i=0,len=Math.max(category.values.length, dataValue.values.length); i<len; i++) {
            dataPoints.push({
                category: <string> category.values[i],
                value: dataValue.values[i]
            });
        }

        dataMax = <number>dataValue.maxLocal; //Power BI calculates this max for me.

        return{
            dataPoints: dataPoints,
            dataMax: dataMax
        };





    }

    export class Visual implements IVisual {

        //Test application code:
        /*
            private target: HTMLElement;
            private updateCount: number;
            private settings: VisualSettings;
            private textNode: Text;

            constructor(options: VisualConstructorOptions) {
                console.log('Visual constructor', options);
                this.target = options.element;
                this.updateCount = 0;
                if (typeof document !== "undefined") {
                    const new_p: HTMLElement = document.createElement("p");
                    new_p.appendChild(document.createTextNode("Update count:"));
                    const new_em: HTMLElement = document.createElement("em");
                    this.textNode = document.createTextNode(this.updateCount.toString());
                    new_em.appendChild(this.textNode);
                    new_p.appendChild(new_em);
                    this.target.appendChild(new_p);
                }
            }

            public update(options: VisualUpdateOptions) {
                console.log("Update method called");
                this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                console.log('Visual update', options);
                if (typeof this.textNode !== "undefined") {
                    this.textNode.textContent = (this.updateCount++).toString();
                }
                let i : number = 0;
                for(i=0;i<1000000;i++){
                    this.textNode.textContent = (i).toString();
                }

                if(options.type == VisualUpdateType.ResizeEnd)
                {
                    this.textNode.textContent = (this.updateCount++).toString();
                }
            }

            private static parseSettings(dataView: DataView): VisualSettings {
                return VisualSettings.parse(dataView) as VisualSettings;
            }


            public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
                return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
            }
            */

            private svg : d3.Selection<SVGElement>;
            //barContainer will contain all the bars.
            private barContainer : d3.Selection<SVGElement>;
            private host: IVisualHost;

            constructor(options: VisualConstructorOptions){
                this.host = options.host;
                this.svg = d3.select(options.element)
                    .append('svg')
                    .classed('barChart', true);

                this.barContainer = this.svg
                    .append('g')
                    .classed('barContainer', true);
            }

            public update(options: VisualUpdateOptions){

                let dynamicData = visualTransform(options, this.host);
                let width = options. viewport.width; //Viewport is the dimensions of the tile.
                let height = options.viewport.height;

                this.svg.attr({
                   width: width,
                   height: height
                });

                //Code to append a single rectangle in the SVG
                // let rect = this.svg
                //     .append('rect')
                //     .attr({
                //         width: 50,
                //         height: 100,
                //         fill: 'red'
                //     });

                let yscale = d3.scale.linear()
                    .domain([0, dynamicData.dataMax])//input range
                    .range([height, 0]); //output range

                /*let xscale = d3.scale.ordinal()// ordinal because the data on the x axis is text and not number.
                    .domain(staticData.map(dataPoint => dataPoint.category))
                    .rangeRoundBands([0, width], 0.1, 0.2);
                */
                let xscale = d3.scale.ordinal()// ordinal because the data on the x axis is text and not number.
                    .domain(dynamicData.dataPoints.map(dataPoint => dataPoint.category))
                    .rangeRoundBands([0, width], 0.1, 0.2);

                /*let bars = this.barContainer
                    .selectAll('.bar')
                    .data(staticData);
                */

                let bars = this.barContainer
                    .selectAll('.bar')
                    .data(dynamicData.dataPoints);

                bars.enter() // Ensures all the data is entered in the view, and is clever so, that it only renders
                              // the new data which is not present.
                    .append('rect')
                    .classed('bar', true);

                bars.attr({
                   width: xscale.rangeBand(),
                   /*height: (data) => {
                    return data.value * 3;
                   }*/
                   height: data => height - yscale(<number>data.value),
                    //  yscale(number) will return a value using linear
                    // equation and this value is substracted from height.
                    //Note that for data.value = 13, yscale(13) = 0, so
                    // 0 will be substrcted from height and assigned to
                    // bars.attr.height.
                    x : data=> xscale(data.category),
                    y : data => yscale(<number>data.value)
                    //y : 0
                });

                bars.exit().remove();
                // Repainting.
            }
    }
}