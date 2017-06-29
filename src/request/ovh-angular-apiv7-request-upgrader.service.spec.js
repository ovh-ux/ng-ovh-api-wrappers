describe("Apiv7RequestUpgrader", function () {
    "use strict";
    var unit;

    beforeEach(module("ovh-angular-apiv7"));
    beforeEach(
        inject(function (apiv7RequestUpgrader) {
            unit = apiv7RequestUpgrader;
        })
    );

    it("sets serviceType option to 'apiv7'", function () {
        var action = unit.buildAction({}, {}, {});
        expect(action.options.serviceType).toEqual("apiv7");
    });

    it("generates url parameter for limit", function () {
        var action = unit.buildAction({}, {}, { limit: 111 });
        expect(action.params.$limit).toEqual(111);
    });

    it("generates url parameter for offset", function () {
        var action = unit.buildAction({}, {}, { offset: 55 });
        expect(action.params.$offset).toEqual(55);
    });

    it("generates url parameter for sort", function () {
        var action = unit.buildAction({}, {}, { sort: { field: "someField", order: "someOrder" } });
        expect(action.params.$sort).toEqual("someField");
        expect(action.params.$order).toEqual("someOrder");
    });

    it("generates url parameter for expansion", function () {
        var action = unit.buildAction({}, {}, { expansion: true });
        expect(action.params.$expand).toEqual(1);
    });

    it("generates url parameters for filter", function () {
        var action = unit.buildAction(
            {},
            {},
            {
                filters: [{ field: "someField", comparator: "maybe", reference: "random" }]
            }
        );
        expect(action.params["someField:maybe"]).toEqual("random");
    });

    it("transform array references to string", function () {
        var action = unit.buildAction(
            {},
            {},
            {
                filters: [{ field: "someField", comparator: "maybe", reference: [1, 2, 3] }]
            }
        );
        expect(action.params["someField:maybe"]).toEqual("1,2,3");
    });

    it("generates and modify url and params for batch", function () {
        var action = unit.buildAction(
            { itemId: "@itemId" },
            { url: "/item/:itemId/someProp" },
            {
                batch: {
                    parameter: "itemId",
                    values: ["a1", "b2"],
                    separator: ";"
                }
            }
        );

        expect(action.params.itemId).toBeUndefined();
        expect(action.params.$batch).toEqual(";");
        expect(action.options.url).toEqual("/item/a1;b2/someProp");
        expect(action.options.isArray).toBeTruthy();
    });

    it("generates and modify url and params for aggregation", function () {
        var action = unit.buildAction({ itemId: "@itemId" }, { url: "/item/:itemId/someProp" }, { aggregation: "itemId" });

        expect(action.params.itemId).toBeUndefined();
        expect(action.params.$aggreg).toEqual(1);
        expect(action.options.url).toEqual("/item/*/someProp");
        expect(action.options.isArray).toBeTruthy();
    });

    describe("aggregation response transformation", function () {
        var fakeAction = { url: "/item/:itemId/someProp" };
        var newTransformResponseSpy;
        var action;

        beforeEach(
            inject(function (apiv7AggregationResponseTransformer) {
                newTransformResponseSpy = jasmine.createSpy("newTransformResponse");
                spyOn(apiv7AggregationResponseTransformer, "create").and.returnValue(newTransformResponseSpy);
                action = unit.buildAction({ itemId: "@itemId" }, fakeAction, { aggregation: "itemId" });
            })
        );

        it(
            "obtains a transformResponse function",
            inject(function (apiv7AggregationResponseTransformer) {
                expect(apiv7AggregationResponseTransformer.create).toHaveBeenCalled();
                expect(action.options.transformResponse).toBe(newTransformResponseSpy);
            })
        );
    });
});
