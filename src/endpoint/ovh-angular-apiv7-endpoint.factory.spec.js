describe("Apiv7Endpoint factory", function () {
    "use strict";
    var endpointInstance;

    describe("constructor invoked with new", function () {
        var ENDPOINT_FIXTURE = {
            mockUrl: "/some/item/:id",
            mockParams: { id: "@id" },
            mockActions: {
                query: {
                    method: "GET",
                    isArray: true
                },
                getStatus: {
                    url: "/some/item/:id/status",
                    method: "GET"
                }
            },
            mockOptions: { some: "option" }
        };

        beforeEach(function () {
            module("ngResource");
            module("ovh-angular-apiv7");
            setupTestEndpoint(ENDPOINT_FIXTURE);
        });

        it("creates a method for each default action", function () {
            ["query", "get", "delete", "remove", "save"].forEach(function (actionName) {
                expect(endpointInstance[actionName] instanceof Function).toBeTruthy();
            });
        });

        it("creates a method for each custom action", function () {
            _.forOwn(ENDPOINT_FIXTURE.mockActions, function (unused, actionName) {
                expect(endpointInstance[actionName] instanceof Function).toBeTruthy();
            });
        });

        it(
            "the method created returns an Apiv7Request object",
            inject(function (Apiv7Request) {
                var request = endpointInstance.getStatus();
                expect(request instanceof Apiv7Request).toBeTruthy();
            })
        );
    });

    function setupTestEndpoint (endpointDesc) {
        return inject(function (Apiv7Endpoint) {
            endpointInstance = new Apiv7Endpoint(endpointDesc.mockUrl, endpointDesc.mockParams, endpointDesc.mockActions, endpointDesc.mockOptions);
        });
    }
});
