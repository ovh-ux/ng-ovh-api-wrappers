describe("apiv7AggregationResponseTransformer", function () {
    "use strict";
    var unit;
    var transformResponse;

    beforeEach(module("ovh-angular-apiv7"));
    beforeEach(
        inject(function (apiv7AggregationResponseTransformer) {
            unit = apiv7AggregationResponseTransformer;
            transformResponse = unit.create({ url: "/item/:itemId/someProp" }, "itemId");
        })
    );

    it("provides a transformResponse function to properly handle aggregated response", function () {
        expect(transformResponse instanceof Function).toBeTruthy();
    });

    it("extracts the key from the path on the transformed response", function () {
        var response = transformResponse(angular.toJson([{ path: "/item/123/someProp", value: {} }, { path: "/item/fooBar/someProp", value: {} }]), {}, 200);
        expect(response[0].key).toEqual("123");
        expect(response[1].key).toEqual("fooBar");
    });

    it("returns response unmodified when http status != 200", function () {
        var response = transformResponse("someResponse", { some: "header" }, 403);
        expect(response).toEqual("someResponse");
    });

    it("sets an error ", function () {
        var response = transformResponse(angular.toJson([{ error: "bad bad error", path: "/item/456/someProp", value: { some: "value" } }]), { some: "header" }, 200);
        expect(response[0].error).toEqual("bad bad error");
    });

    it("calls the original transformResponse when set", function () {
        var fakeTransformSpy = jasmine.createSpy("fakeTransform").and.callFake(function (response) {
            var newResponse = angular.fromJson(response);
            newResponse.some = "transformed " + newResponse.some;
            return newResponse;
        });
        var transform = unit.create({ url: "/item/:itemId/someProp", transformResponse: fakeTransformSpy }, "itemId");
        var transformed = transform(angular.toJson([{ error: null, path: "/item/456/someProp", value: { some: "thing" } }]), { some: "header" }, 200);

        expect(fakeTransformSpy).toHaveBeenCalledWith(angular.toJson({ some: "thing" }), { some: "header" }, 200);
        expect(transformed).toEqual([{ path: "/item/456/someProp", key: "456", value: { some: "transformed thing" } }]);
    });
});
