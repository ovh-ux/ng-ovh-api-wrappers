describe("Apiv7Request", function () {
    "use strict";
    var orderRequest;
    var requestExecutionFunc;
    var resourceStub;
    var REQUEST_FIXTURE = {
        defaultUrl: "/me/order/:orderId",
        defaultParams: { orderId: "@orderId" },
        actions: {
            method: "GET",
            isArray: true
        }
    };

    describe("the constructor", function () {
        beforeEach(function () {
            setupApiModules();
        });

        it(
            "constructs an Apiv7Request object",
            inject(function (Apiv7Request) {
                setupTestRequest(REQUEST_FIXTURE, { bogus: "v7Option" });

                expect(orderRequest.defaultUrl).toEqual(REQUEST_FIXTURE.defaultUrl);
                expect(orderRequest.defaultParams).toEqual(REQUEST_FIXTURE.defaultParams);
                expect(orderRequest.actionOptions).toEqual(REQUEST_FIXTURE.actions);
                expect(orderRequest.v7Options.bogus).toEqual("v7Option");
                expect(orderRequest instanceof Apiv7Request).toBeTruthy();
                expect(orderRequest.execute instanceof Function).toBeTruthy();
            })
        );

        it("assigns the defaultUrl when action does not override it", function () {
            var requestOptions = _.merge({}, { url: null }, REQUEST_FIXTURE);
            setupTestRequest(requestOptions, {});

            expect(orderRequest.actionOptions.url).toEqual(REQUEST_FIXTURE.defaultUrl);
        });
    });

    describe("execute(params)", function () {
        var mockOrderId = 123;
        var mockOptionsReturn = { bogus: "option" };
        var mockParamsReturn = { orderId: mockOrderId, bogus: "param" };

        beforeEach(function () {
            setupApiModulesWithMockNgResource();
            setupTestRequest(REQUEST_FIXTURE, { v7: "option" }, ["batch"]);

            inject(function (apiv7RequestUpgrader) {
                spyOn(apiv7RequestUpgrader, "buildAction").and.returnValue({
                    options: mockOptionsReturn,
                    params: mockParamsReturn
                });
            });
        });

        it(
            "it invokes apiv7RequestUpgrader.buildAction",
            inject(function (apiv7RequestUpgrader) {
                orderRequest.execute({ some: "Param" });

                expect(apiv7RequestUpgrader.buildAction).toHaveBeenCalledWith({ some: "Param" }, REQUEST_FIXTURE.actions, { v7: "option" });
            })
        );

        it(
            "creates a $resource instance with options from apiv7RequestUpgrader",
            inject(function (apiv7RequestUpgrader) {
                orderRequest.execute();

                expect(apiv7RequestUpgrader.buildAction).toHaveBeenCalled();
                expect(resourceStub).toHaveBeenCalledWith(
                    REQUEST_FIXTURE.defaultUrl,
                    REQUEST_FIXTURE.defaultParams,
                    {
                        doRequest: mockOptionsReturn
                    },
                    undefined
                );
            })
        );

        it("calls the request action with params from apiv7RequestUpgrader", function () {
            orderRequest.execute();

            expect(requestExecutionFunc).toHaveBeenCalledWith(mockParamsReturn);
        });

        it("throws an error when trying to execute a disabled apiv7 operation", function () {
            expect(function () {
                orderRequest.batch("someParam", [1, 2], ";").execute();
            }).toThrow();
        });
    });

    describe("the chained methods: ", function () {
        beforeEach(function () {
            setupApiModules();
            setupTestRequest(REQUEST_FIXTURE);
        });

        describe("expand(toggle)", function () {
            it("sets expand in v7 config", function () {
                var req = orderRequest.expand();

                expect(req.v7Options.expansion).toBeTruthy();
            });

            it("unsets expand in v7 config", function () {
                var req = orderRequest.expand(false);

                expect(req.v7Options.expansion).toBeFalsy();
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.expand();
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("sort(field, order)", function () {
            it("sets sort field and order in v7 config", function () {
                var req = orderRequest.sort("someField", "SOMEORDER");

                expect(req.v7Options.sort).toEqual({
                    field: "someField",
                    order: "SOMEORDER"
                });
            });

            it("defaults the sort order argument as ASC", function () {
                var req = orderRequest.sort("someField");

                expect(req.v7Options.sort).toEqual({
                    field: "someField",
                    order: "ASC"
                });
            });

            it("uppercases the sort order argument", function () {
                var req = orderRequest.sort("someField", "someorder");

                expect(req.v7Options.sort).toEqual({
                    field: "someField",
                    order: "SOMEORDER"
                });
            });

            it("unsets the sort option when passed an unset or empty field", function () {
                var req = orderRequest.sort("someField", "someOrder").sort("");

                expect(req.v7Options.sort).toBeUndefined();
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.sort("someField", "someOrder");
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("limit(limit)", function () {
            it("sets limit in v7 config", function () {
                var req = orderRequest.limit(-111);

                expect(req.v7Options.limit).toEqual(-111);
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.limit(10);
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("offset(offset)", function () {
            it("sets offset in v7 config", function () {
                var req = orderRequest.offset(32);

                expect(req.v7Options.offset).toEqual(32);
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.offset(10);
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("setFilter(field, comparator, reference)", function () {
            it("sets a filter in v7 config", function () {
                var req = orderRequest.setFilter("someField", "someComp", "someRef");

                expect(req.v7Options.filters[0]).toEqual({
                    field: "someField",
                    comparator: "someComp",
                    reference: "someRef"
                });
            });

            it("unsets the apiv7 filter option when passed an empty field", function () {
                var req = orderRequest.setFilter("someField", "someComp", "someRef").setFilter(false);

                expect(req.v7Options.filters).toBeUndefined();
            });

            it("joins array argument with a comma separator", function () {
                var req = orderRequest.setFilter("someField", "someComp", ["some", "array"]);

                expect(req.v7Options.filters[0].reference).toEqual("some,array");
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.offset(10);
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("addFilter(field, comparator, reference)", function () {
            it("adds filters fields in v7 config", function () {
                var req = orderRequest.addFilter("field1", "comp1", "ref2").addFilter("field2", "comp2", "ref2");

                expect(req.v7Options.filters[0]).toEqual({
                    field: "field1",
                    comparator: "comp1",
                    reference: "ref2"
                });
                expect(req.v7Options.filters[1]).toEqual({
                    field: "field2",
                    comparator: "comp2",
                    reference: "ref2"
                });
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.addFilter("field", "comp1", "ref2");
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("aggregate(parameterToWildcard)", function () {
            it("sets up wildcard parameter in v7 config", function () {
                var req = orderRequest.aggregate("someParam");

                expect(req.v7Options.aggregation.length).toEqual(1);
                expect(req.v7Options.aggregation[0]).toEqual("someParam");


                req = req.aggregate("oneMoreParam");
                expect(req.v7Options.aggregation.length).toEqual(2);
                expect(req.v7Options.aggregation[0]).toEqual("someParam");
                expect(req.v7Options.aggregation[1]).toEqual("oneMoreParam");
            });

            it("unsets the wildcard parameter in v7 config when passed a falsy param", function () {
                var req = orderRequest.aggregate("someParam").aggregate(false);
                expect(req.v7Options.aggregation.length).toEqual(1);
            });

            it("returns a new request object (immutability)", function () {
                var req = orderRequest.aggregate("someParam");
                expect(req).not.toBe(orderRequest);
                expect(req).not.toEqual(orderRequest);
            });
        });

        describe("clone method", function () {
            it("clone method must return an instance of Apiv7Request", function () {
                var req = orderRequest;
                expect(req.clone().constructor.name).toBe("Apiv7Request");
            });
        });
    });

    function setupApiModules () {
        module("ngResource");
        module("ovh-angular-apiv7");
    }

    function setupApiModulesWithMockNgResource () {
        module("ovh-angular-apiv7", function ($provide) {
            requestExecutionFunc = jasmine.createSpy("requestExecutionFunc");
            resourceStub = jasmine.createSpy("resourceStub");
            resourceStub.and.returnValue({ doRequest: requestExecutionFunc });
            $provide.value("$resource", resourceStub);
        });
    }

    function setupTestRequest (requestArgs, v7Options, v7DisabledOperations) {
        return inject(function (Apiv7Request) {
            orderRequest = new Apiv7Request(requestArgs.defaultUrl, requestArgs.defaultParams, requestArgs.actions, requestArgs.options, v7Options, v7DisabledOperations);
        });
    }
});
