import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {EzspBuffalo} from "../../../src/adapter/ember/ezsp/buffalo";
import {EZSP_MAX_FRAME_LENGTH} from "../../../src/adapter/ember/ezsp/consts";
import {FlowControlType, RouteRecordStatus, XncpCommandId} from "../../../src/adapter/ember/ezsp/xncp";

describe("Ember XNCP Buffalo", () => {
    let buffalo: EzspBuffalo;

    beforeAll(async () => {});

    afterAll(async () => {});

    beforeEach(() => {
        buffalo = new EzspBuffalo(Buffer.alloc(EZSP_MAX_FRAME_LENGTH));
    });

    afterEach(() => {});

    describe("XNCP Command ID serialization", () => {
        it("writes and reads XNCP command ID", () => {
            buffalo.writeXncpCommandId(XncpCommandId.SET_ROUTE_TABLE_ENTRY_REQ);
            expect(buffalo.getWritten().length).toBe(2);

            buffalo.setPosition(0);
            const readCommandId = buffalo.readXncpCommandId();
            expect(readCommandId).toBe(XncpCommandId.SET_ROUTE_TABLE_ENTRY_REQ);
        });

        it("writes and reads GET_ROUTE_TABLE_ENTRY_REQ command ID", () => {
            buffalo.writeXncpCommandId(XncpCommandId.GET_ROUTE_TABLE_ENTRY_REQ);
            expect(buffalo.getWritten().length).toBe(2);

            buffalo.setPosition(0);
            const readCommandId = buffalo.readXncpCommandId();
            expect(readCommandId).toBe(XncpCommandId.GET_ROUTE_TABLE_ENTRY_REQ);
        });
    });

    describe("XNCP Set Route Table Entry Request", () => {
        it("writes SET_ROUTE_TABLE_ENTRY_REQ payload", () => {
            buffalo.writeXncpSetRouteTableEntryRequest(
                5, // index
                0x1234, // destination
                0x5678, // nextHop
                RouteRecordStatus.ACTIVE_AGE_2, // status
                3, // cost
            );

            const expected = Buffer.from([
                0x05, // index
                0x34,
                0x12, // destination (little endian)
                0x78,
                0x56, // nextHop (little endian)
                0x80, // status (ACTIVE_AGE_2)
                0x03, // cost
            ]);

            expect(buffalo.getWritten()).toStrictEqual(expected);
        });
    });

    describe("XNCP Get Route Table Entry Request", () => {
        it("writes GET_ROUTE_TABLE_ENTRY_REQ payload", () => {
            buffalo.writeXncpGetRouteTableEntryRequest(7); // index

            const expected = Buffer.from([0x07]); // index

            expect(buffalo.getWritten()).toStrictEqual(expected);
        });
    });

    describe("XNCP Get Flow Control Type Request", () => {
        it("writes GET_FLOW_CONTROL_TYPE_REQ payload (empty)", () => {
            buffalo.writeXncpGetFlowControlTypeRequest();

            // GET_FLOW_CONTROL_TYPE_REQ has no payload, so nothing should be written
            expect(buffalo.getWritten()).toStrictEqual(Buffer.from([]));
        });
    });

    describe("XNCP Get Flow Control Type Response", () => {
        it("reads GET_FLOW_CONTROL_TYPE_RSP payload with SOFTWARE flow control", () => {
            const responseData = Buffer.from([FlowControlType.SOFTWARE]);

            buffalo = new EzspBuffalo(responseData);

            const result = buffalo.readXncpGetFlowControlTypeResponse();

            expect(result).toBe(FlowControlType.SOFTWARE);
        });

        it("reads GET_FLOW_CONTROL_TYPE_RSP payload with HARDWARE flow control", () => {
            const responseData = Buffer.from([FlowControlType.HARDWARE]);

            buffalo = new EzspBuffalo(responseData);

            const result = buffalo.readXncpGetFlowControlTypeResponse();

            expect(result).toBe(FlowControlType.HARDWARE);
        });
    });

    describe("XNCP Get Route Table Entry Response", () => {
        it("reads GET_ROUTE_TABLE_ENTRY_RSP payload", () => {
            const responseData = Buffer.from([
                0x34,
                0x12, // destination (little endian)
                0x78,
                0x56, // nextHop (little endian)
                0x80, // status (ACTIVE_AGE_2)
                0x03, // cost
            ]);

            buffalo = new EzspBuffalo(responseData);

            const result = buffalo.readXncpGetRouteTableEntryResponse();

            expect(result.destination).toBe(0x1234);
            expect(result.nextHop).toBe(0x5678);
            expect(result.status).toBe(RouteRecordStatus.ACTIVE_AGE_2);
            expect(result.cost).toBe(3);
        });
    });

    describe("XNCP Frame serialization", () => {
        it("writes XNCP command ID using writeUInt16 (little-endian)", () => {
            buffalo.writeUInt16(XncpCommandId.GET_ROUTE_TABLE_ENTRY_REQ);
            // GET_ROUTE_TABLE_ENTRY_REQ = 0x0007, in little-endian: [0x07, 0x00]
            expect(buffalo.getWritten()).toStrictEqual(Buffer.from([0x07, 0x00]));
        });

        it("reads XNCP command ID using readUInt16 (little-endian)", () => {
            buffalo = new EzspBuffalo(Buffer.from([0x07, 0x00]));
            const commandId = buffalo.readUInt16();
            expect(commandId).toBe(0x0007); // GET_ROUTE_TABLE_ENTRY_REQ
        });
    });
});

describe("RouteRecordStatus enum", () => {
    it("has expected values", () => {
        expect(RouteRecordStatus.ACTIVE_AGE_0).toBe(0x00);
        expect(RouteRecordStatus.ACTIVE_AGE_1).toBe(0x40);
        expect(RouteRecordStatus.ACTIVE_AGE_2).toBe(0x80);
        expect(RouteRecordStatus.BEING_DISCOVERED).toBe(0x01);
        expect(RouteRecordStatus.UNUSED).toBe(0x03);
        expect(RouteRecordStatus.VALIDATING).toBe(0x04);
    });
});

describe("FlowControlType enum", () => {
    it("has expected values", () => {
        expect(FlowControlType.SOFTWARE).toBe(0x00);
        expect(FlowControlType.HARDWARE).toBe(0x01);
    });
});

describe("XncpCommandId enum", () => {
    it("has expected request and response command IDs", () => {
        expect(XncpCommandId.SET_ROUTE_TABLE_ENTRY_REQ).toBe(0x0006);
        expect(XncpCommandId.GET_ROUTE_TABLE_ENTRY_REQ).toBe(0x0007);
        expect(XncpCommandId.SET_ROUTE_TABLE_ENTRY_RSP).toBe(0x8006);
        expect(XncpCommandId.GET_ROUTE_TABLE_ENTRY_RSP).toBe(0x8007);
    });
});
