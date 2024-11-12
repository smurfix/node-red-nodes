
var should = require("should");
var helper = require("node-red-node-test-helper");
var testNode = require('../../../parsers/base85/70-base85.js');

describe('base85 node', function() {
    "use strict";


    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload().then(function() {
            helper.stopServer(done);
        });
    });

    it("should be loaded with correct defaults", function(done) {
        var flow = [{"id":"n1", "type":"base85", "name":"base851", "wires":[[]]}];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            n1.should.have.property("name", "base851");
            n1.should.have.property("charset", "btoa");
            done();
        });
    });

    it('should convert a Buffer to base85', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","K|(`BMMg(RNlHshO-@fxQBqS>RaRG6Sy}");
                done();
            });
            n1.emit("input", {payload: Buffer.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")});
        });
    });

    it('should convert a Buffer to base85 using another property - foo', function(done) {
        var flow = [{id:"n1", type:"base85", property:"foo", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("foo","K|(`BMMg(RNlHshO-@fxQBqS>RaRG6Sy}");
                done();
            });
            n1.emit("input", {foo: Buffer.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")});
        });
    });

    it('should convert base85 to a Buffer', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload");
                msg.payload.should.be.instanceof(Buffer);
                msg.payload.toString().should.equal("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                done();
            });
            n1.emit("input", {payload:"K|(`BMMg(RNlHshO-@fxQBqS>RaRG6Sy}"});
        });
    });

    it('should convert base85 to a Buffer using another property - foo', function(done) {
        var flow = [{id:"n1", type:"base85", property:"foo", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("foo");
                msg.foo.should.be.instanceof(Buffer);
                msg.foo.toString().should.equal("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                done();
            });
            n1.emit("input", {foo:"K|(`BMMg(RNlHshO-@fxQBqS>RaRG6Sy}"});
        });
    });

    it('should convert base85 to a Buffer using ascii85', function(done) {
        var flow = [{"id":"n1", "type":"base85", "charset":"ascii85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload");
                msg.payload.should.be.instanceof(Buffer);
                msg.payload.toString().should.equal("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                done();
            });
            n1.emit("input", {payload:"<~5sdq,77Kd<8P2WL9hnJ\\;,U=l<E<1\'=]t~>"});
        });
    });

    it('should convert a Buffer to base85 using ascii85', function(done) {
        var flow = [{"id":"n1", "type":"base85", "charset":"ascii85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","<~5sdq,77Kd<8P2WL9hnJ\\;,U=l<E<1\'=]t~>");
                done();
            });
            n1.emit("input", {payload: Buffer.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")});
        });
    });

    it('should convert base85 to a Buffer using ZMP', function(done) {
        var flow = [{"id":"n1", "type":"base85", "charset":"z85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload");
                msg.payload.should.be.instanceof(Buffer);
                msg.payload.toString().should.equal("!ABCDEFGHIJKLMNOPQRSTUVWXYZ!");
                done();
            });
            n1.emit("input", {payload:"aWFBZl}6Nnnj=ADoIFnTp/ga?r8($2sxO/J"});
        });
    });

    it('should convert a Buffer to base85 using ZMP', function(done) {
        var flow = [{"id":"n1", "type":"base85", "charset":"z85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","aWFBZl}6Nnnj=ADoIFnTp/ga?r8($2sxO/J");
                done();
            });
            n1.emit("input", {payload: Buffer.from("!ABCDEFGHIJKLMNOPQRSTUVWXYZ!")});
        });
    });

    it('should try to encode a non base85 string', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload");
                msg.payload.should.equal("RAqB?AbWjVU4CE");
                done();
            });
            n1.emit("input", {payload:"Test {}[]~`"});
        });
    });

    it('ignore msg with a boolean payload', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function() {
                done();
            }, 25);
            n1.emit("input", {payload:true});
        });
    });

    it('ignore msg with a numeric payload', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function() {
                done();
            }, 25);
            n1.emit("input", {payload:9999});
        });
    });

    it('ignore msg with an object payload', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function() {
                done();
            }, 25);
            n1.emit("input", {payload:{A:1}});
        });
    });

    it('ignore msg with no payload', function(done) {
        var flow = [{"id":"n1", "type":"base85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function() {
                done();
            }, 25);
            n1.emit("input", {topic:1});
        });
    });

    it('can force encode string to base85', function(done) {
        var flow = [{id:"n1", type:"base85", action:"str", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","VQyr3");
                done();
            });
            n1.emit("input", {payload:"andy"});
        });
    });

    it('can force encode boolean to base85', function(done) {
        var flow = [{id:"n1", type:"base85", action:"str", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","baHiN");
                done();
            });
            n1.emit("input", {payload:true});
        });
    });

    it('can force encode number to base85', function(done) {
        var flow = [{id:"n1", type:"base85", action:"str", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","F)}kW");
                done();
            });
            n1.emit("input", {payload:1234});
        });
    });

    it('can force encode object to base85', function(done) {
        var flow = [{id:"n1", type:"base85", action:"str", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload","dm>>XIx&3");
                done();
            });
            n1.emit("input", {payload:{a:1}});
        });
    });

    it('can force decode base85 to string', function(done) {
        var flow = [{id:"n1", type:"base85", action:"b85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.payload.should.be.instanceof(String);
                msg.should.have.a.property("payload","Hello World");
                done();
            });
            n1.emit("input", {payload:"NM&qnZy;B1a%^M"});
        });
    });

    it('wont decode base85 to string if not a valid string', function(done) {
        var flow = [{id:"n1", type:"base85", action:"b85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function () {
                try {
                    var logEvents = helper.log().args.filter(function (evt) {
                        return evt[0].type == "base85";
                    });
                    logEvents[0][0].should.have.a.property('msg');
                    logEvents[0][0].msg.toString().should.startWith("base85.error.invalid");
                    done();
                } catch (e) {
                    done(e);
                }
            }, 45);
            n1.emit("input", {payload:"andy{\\/}!"});
        });
    });

    it('wont decode base85 to string if not a string', function(done) {
        var flow = [{id:"n1", type:"base85", action:"b85", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                done("should not get here with no payload.");
            });
            setTimeout(function () {
                try {
                    var logEvents = helper.log().args.filter(function (evt) {
                        return evt[0].type == "base85";
                    });
                    logEvents[0][0].should.have.a.property('msg');
                    logEvents[0][0].msg.toString().should.startWith("base85.error.nonbase85");
                    done();
                } catch (e) {
                    done(e);
                }
            }, 45);
            n1.emit("input", {payload:1234});
        });
    });

});
