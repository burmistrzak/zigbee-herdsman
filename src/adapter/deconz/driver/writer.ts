/* istanbul ignore file */
/* eslint-disable */
import * as stream from 'stream';
import Frame from './frame';
// @ts-ignore
import slip from 'slip';
import {logger} from '../../../utils/logger';

class Writer extends stream.Readable {
    public writeFrame(frame: Frame): void {
        const buffer = slip.encode(frame.toBuffer());
        logger.debug(`--> frame [${[...buffer]}]`, 'zigbee-herdsman:deconz:driver:writer');
        this.push(buffer);
    }

    public _read(): void {}
}

export default Writer;
