const escapeRegex = function (string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = function(RED) {
    "use strict";
    var base85 = require('base85-full');

    function Base85Node(n) {
        RED.nodes.createNode(this,n);
        this.action = n.action || "";
        this.charset = n.charset || "btoa";
        this.property = n.property || "payload";
        var node = this;
        //
        // check that it our input only contains valid characters;
        // the ascii85 framing is not part of the regexp so we're lazy
        this.regexp = new RegExp('^[' + 
                                 escapeRegex(base85.alphabets[this.charset].chars + '<~>') +
                                 ']*$');

        // str / buffer: convert buffer to string: encode
        // b85 / string: convert string to buffer: decode
        this.on("input", function(msg) {
            var value = RED.util.getMessageProperty(msg,node.property);
            if (value !== undefined) {
                // decide what to do
                var action = node.action;
                if (action === "str") {
                    value = RED.util.ensureBuffer(value);
                } else if (action === "b85") {
                    if (Buffer.isBuffer(value)) {
                        value = value.toString();
                    } else if (typeof value !== "string") {
                        node.error(RED._("base85.error.nonbase85"),msg);
                        return;
                    }
                } else if (Buffer.isBuffer(value)) {
                    action = "str";
                } else if (typeof value === "string") {
                    if (this.regexp.test(value)) {
                        action = "b85d";
                    } else {
                        // Not encodeable. Try anyway.
                        value = RED.util.ensureBuffer(value);
                        action = "str";
                    }
                } else {
                    node.error(RED._("base85.warn.cannothandle.C"),msg);
                    return;
                }

                // and do it
                if (action === "str") {
                    value = base85.encode(value, node.charset);

                } else { // action === "b85"
                    if (! this.regexp.test(value)) {
                        node.error(RED._("base85.error.invalid"),msg);
                        return;
                    }
                    value = base85.decode(value, node.charset);
                    if (action === "b85") {
                        value = value.toString("binary");
                    }

                }
                RED.util.setMessageProperty(msg,node.property,value);
                node.send(msg);
            }
            else { node.warn(RED._("base85.warn.noproperty")); }
        });
    }
    RED.nodes.registerType("base85",Base85Node);
}
