export class Node {
    constructor(label) {
        this.properties = {};
        this.nodes = {};
    }
    //TODO: handle .'s (Maybe make them into a tree structure)
    getProperty(property) {
        return this.properties[property];
    }

    setProperty(property, value) {
        if (isFinite(value)) {
            value = parseFloat(value);
        }
        this.properties[property] = value;
    }

    addNode(name, node) {
        if (name.match(/\[i [0-9]+\]?/)) {
            name = "i";
        }

        if (typeof this.nodes[name] === "undefined") {
            this.nodes[name] = [];
        }

        this.nodes[name].push(node);
    }

    toJSON() {
        let json = {};
        if (Object.keys(this.properties).length > 0) {
            json.properties = this.properties;
        }
        if (Object.keys(this.nodes).length > 0) {
            json.nodes = {};
            for (let key in this.nodes) {
                let nodes = this.nodes[key];
                json.nodes[key] = [];
                for (let inode in nodes) {
                    let node = nodes[inode];
                    json.nodes[key].push(node.toJSON());
                }
            }
        }
        return json;
    }


    toXML(parent) {
        if (!parent) {
            var XMLWriter = require('xml-writer');
            let xw = new XMLWriter(true);
            xw.startDocument();
            parent = xw.startElement("root");
        }

        for (let key in this.properties) {
            let value = this.properties[key];
            parent.writeAttribute(key, value);
        }

        for(let key in this.nodes) {
            let nodes = this.nodes[key];
            let xmlKey = key;
            if (isFinite(key[0])) {
                xmlKey = "num_"+key;
            }
            for (let i in nodes) {
                let node = nodes[i];
                parent.startElement(xmlKey);
                node.toXML(parent);
                parent.endElement();
            }
        }
        return parent;
    }
}

export function load(data) {
    let lines = data.split("\n");

    let nodes = []; //stack
    let currentNode = new Node();

    for(let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line[line.length-1] == "\r") {
            line = line.substring(0, line.length-1);
        }

        let tokens = tokenize(line);

        if (tokens.length == 0) {
            continue;
        }

        if (tokens[0] == "BEGIN") {
            nodes.push(currentNode);
            let label = tokens[1];

            let newNode = new Node();
            currentNode.addNode(label, newNode);
            currentNode = newNode;

            if (tokens.length > 2) {
                for (let j = 2; j < tokens.length; j += 2) {
                    let key = tokens[j];
                    let value = tokens[j + 1];
                    //console.log("keyvalue", key, value)
                    currentNode.setProperty(key, value);
                }

                let upperNode = nodes.pop();
                currentNode = upperNode;
            }


        }
        else if (tokens[0] == "END") {
            let upperNode = nodes.pop();
            currentNode = upperNode;
        }
        else {
            let key = tokens[0];
            let value = tokens[1];
            currentNode.setProperty(key, value);
        }
    }

    return currentNode;
}

//approach borrowed from PASaveEditor
export function tokenize(line) {
    var tokens = [];

    var tokenStart = 0;
    for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (c == " " || c == "\t") {
            if (tokenStart != i) {
                tokens.push(line.substring(tokenStart, i))
            }
            tokenStart = i + 1;
        }
        else if (c == '"') {
            var endQuotes = line.indexOf('"', i+1);
            tokens.push(line.substring(i+1, endQuotes-1));
            i = endQuotes;
            tokenStart = i+1;
        }
        else {
            //skip ahead to next space or tab
            let j = i;
            let match = false;
            for (; j < line.length; j++) {
                if (line[j] == " " || line[j] == "\t") {
                    match = true;
                    break;
                }
            }

            i = j-1;

            if (!match) {
                break;
            }
        }
    }
    if (tokenStart < line.length) {
        tokens.push(line.substring(tokenStart, line.length));
    }
    return tokens;
}
/*
import * as fs from "fs";

var rawdata = fs.readFileSync("./stuff.prison").toString();
let data = load(rawdata);

//console.log(JSON.stringify(data.toJSON()));
console.log(data.toXML().toString());*/