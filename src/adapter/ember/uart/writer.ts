/* istanbul ignore file */
import {Readable, ReadableOptions} from "stream";
import {logger} from "../../../utils/logger";


export class AshWriter extends Readable {
    private bytesToWrite: number[];

    constructor(opts?: ReadableOptions) {
        super(opts);

        this.bytesToWrite = [];
    }

    private writeBytes(): void {
        const buffer = Buffer.from(this.bytesToWrite);
        this.bytesToWrite = [];

        logger.debug(`>>>> [FRAME raw=${buffer.toString('hex')}]`, 'zigbee-herdsman:ember:uart:ash:writer');

        // this.push(buffer);
        this.emit('data', buffer);
    }

    public writeByte(byte: number): void {
        this.bytesToWrite.push(byte);
    }

    public writeAvailable(): boolean {
        if (this.readableLength < this.readableHighWaterMark) {
            return true;
        } else {
            this.writeFlush();

            return false;
        }
    }

    /**
     * If there is anything to send, send to the port.
     */
    public writeFlush(): void {
        if (this.bytesToWrite.length) {
            this.writeBytes();
        }
    }

    public _read(): void {
    }
}
