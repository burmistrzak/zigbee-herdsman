/** XNCP Command IDs and types */

export enum XncpCommandId {
    GET_SUPPORTED_FEATURES_REQ = 0x0000,
    SET_SOURCE_ROUTE_REQ = 0x0001,
    GET_MFG_TOKEN_OVERRIDE_REQ = 0x0002,
    GET_BUILD_STRING_REQ = 0x0003,
    GET_FLOW_CONTROL_TYPE_REQ = 0x0004,
    GET_CHIP_INFO_REQ = 0x0005,
    SET_ROUTE_TABLE_ENTRY_REQ = 0x0006,
    GET_ROUTE_TABLE_ENTRY_REQ = 0x0007,
    GET_TX_POWER_INFO_REQ = 0x0008,

    GET_SUPPORTED_FEATURES_RSP = GET_SUPPORTED_FEATURES_REQ | 0x8000,
    SET_SOURCE_ROUTE_RSP = SET_SOURCE_ROUTE_REQ | 0x8000,
    GET_MFG_TOKEN_OVERRIDE_RSP = GET_MFG_TOKEN_OVERRIDE_REQ | 0x8000,
    GET_BUILD_STRING_RSP = GET_BUILD_STRING_REQ | 0x8000,
    GET_FLOW_CONTROL_TYPE_RSP = GET_FLOW_CONTROL_TYPE_REQ | 0x8000,
    GET_CHIP_INFO_RSP = GET_CHIP_INFO_REQ | 0x8000,
    SET_ROUTE_TABLE_ENTRY_RSP = SET_ROUTE_TABLE_ENTRY_REQ | 0x8000,
    GET_ROUTE_TABLE_ENTRY_RSP = GET_ROUTE_TABLE_ENTRY_REQ | 0x8000,
    GET_TX_POWER_INFO_RSP = GET_TX_POWER_INFO_REQ | 0x8000,

    UNKNOWN = 0xffff,
}

/** Route record status for XNCP route table entries */
export enum RouteRecordStatus {
    ACTIVE_AGE_0 = 0x00,
    ACTIVE_AGE_1 = 0x40,
    ACTIVE_AGE_2 = 0x80,

    BEING_DISCOVERED = 0x01,
    UNUSED = 0x03,
    VALIDATING = 0x04,
}

/** Flow control type for XNCP */
export enum FlowControlType {
    SOFTWARE = 0x00,
    HARDWARE = 0x01,
}

/** XNCP frame structure for requests and responses */
export interface XncpRequest {
    commandId: XncpCommandId;
    payload: Buffer;
}

/** Route table entry for XNCP commands */
export interface XncpRouteTableEntry {
    destination: number; // NodeId (uint16)
    nextHop: number; // NodeId (uint16)
    status: RouteRecordStatus;
    cost: number; // uint8
}

/** Payload for SET_ROUTE_TABLE_ENTRY_REQ */
export interface XncpSetRouteTableEntryRequest {
    index: number; // uint8
    destination: number; // NodeId (uint16)
    nextHop: number; // NodeId (uint16)
    status: RouteRecordStatus;
    cost: number; // uint8
}

/** Payload for GET_ROUTE_TABLE_ENTRY_REQ */
export interface XncpGetRouteTableEntryRequest {
    index: number; // uint8
}

/** Payload for GET_ROUTE_TABLE_ENTRY_RSP */
export interface XncpGetRouteTableEntryResponse {
    destination: number; // NodeId (uint16)
    nextHop: number; // NodeId (uint16)
    status: RouteRecordStatus;
    cost: number; // uint8
}
