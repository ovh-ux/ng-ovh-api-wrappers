describe("apiv7 service", function () {
    "use strict";
    var unit;
    var mockUrl = "/url";
    var mockParams = { id: "@id" };
    var mockActions = {
        query: {
            method: "GET",
            isArray: true
        },
        getStatus: {
            url: "/some/item/:id/status",
            method: "GET"
        }
    };
    var mockOptions = { some: "option" };
    var spy = jasmine.createSpy("Apiv7Endpoint");

    beforeEach(function () {
        module("ngResource");
        module("ovh-angular-apiv7", function ($provide) {
            $provide.value("Apiv7Endpoint", spy);
        });
    });

    beforeEach(
        inject(function (apiv7) {
            unit = apiv7;
        })
    );

    it(
        "invokes the Apiv7Endpoint constructor",
        inject(function () {
            unit(mockUrl, mockParams, mockActions, mockOptions);
            expect(spy).toHaveBeenCalledWith(mockUrl, mockParams, mockActions, mockOptions);
        })
    );

    it(
        "creates a new Apiv7Endpoint",
        inject(function (Apiv7Endpoint) {
            var endpoint = unit(mockUrl, mockParams, mockActions, mockOptions);
            expect(endpoint instanceof Apiv7Endpoint).toBeTruthy();
        })
    );
});
