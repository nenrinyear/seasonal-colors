const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_DEFLATE_STORED_BLOCK_SIZE = 65535;

type Rgb = {
    r: number;
    g: number;
    b: number;
};

export function createSolidColorPng(width: number, height: number, color: Rgb): Uint8Array {
    const ihdr = new Uint8Array(13);
    writeUint32(ihdr, 0, width);
    writeUint32(ihdr, 4, height);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 3; // indexed color
    ihdr[10] = 0; // deflate compression
    ihdr[11] = 0; // adaptive filtering
    ihdr[12] = 0; // no interlace

    const palette = new Uint8Array([color.r, color.g, color.b]);
    const scanlines = new Uint8Array((width + 1) * height);
    const idat = createZlibStoredStream(scanlines);

    return concatUint8Arrays([
        PNG_SIGNATURE,
        createChunk('IHDR', ihdr),
        createChunk('PLTE', palette),
        createChunk('IDAT', idat),
        createChunk('IEND', new Uint8Array()),
    ]);
}

function createZlibStoredStream(data: Uint8Array): Uint8Array {
    const blockCount = Math.ceil(data.length / MAX_DEFLATE_STORED_BLOCK_SIZE);
    const output = new Uint8Array(2 + blockCount * 5 + data.length + 4);
    let offset = 0;
    let dataOffset = 0;

    output[offset++] = 0x78;
    output[offset++] = 0x01;

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
        const remainingLength = data.length - dataOffset;
        const blockLength = Math.min(remainingLength, MAX_DEFLATE_STORED_BLOCK_SIZE);
        const isFinalBlock = blockIndex === blockCount - 1;

        output[offset++] = isFinalBlock ? 0x01 : 0x00;
        output[offset++] = blockLength & 0xff;
        output[offset++] = (blockLength >> 8) & 0xff;
        output[offset++] = (~blockLength) & 0xff;
        output[offset++] = ((~blockLength) >> 8) & 0xff;
        output.set(data.subarray(dataOffset, dataOffset + blockLength), offset);

        offset += blockLength;
        dataOffset += blockLength;
    }

    writeUint32(output, offset, adler32(data));
    return output;
}

function createChunk(type: string, data: Uint8Array): Uint8Array {
    const typeBytes = asciiBytes(type);
    const chunk = new Uint8Array(12 + data.length);

    writeUint32(chunk, 0, data.length);
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    writeUint32(chunk, 8 + data.length, crc32(typeBytes, data));

    return chunk;
}

function writeUint32(bytes: Uint8Array, offset: number, value: number) {
    bytes[offset] = (value >>> 24) & 0xff;
    bytes[offset + 1] = (value >>> 16) & 0xff;
    bytes[offset + 2] = (value >>> 8) & 0xff;
    bytes[offset + 3] = value & 0xff;
}

function asciiBytes(value: string) {
    return new Uint8Array([...value].map((char) => char.charCodeAt(0)));
}

function concatUint8Arrays(arrays: Uint8Array[]) {
    const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
    const output = new Uint8Array(totalLength);
    let offset = 0;

    for (const array of arrays) {
        output.set(array, offset);
        offset += array.length;
    }

    return output;
}

function adler32(data: Uint8Array) {
    let a = 1;
    let b = 0;

    for (const byte of data) {
        a = (a + byte) % 65521;
        b = (b + a) % 65521;
    }

    return ((b << 16) | a) >>> 0;
}

const CRC_TABLE = createCrcTable();

function crc32(type: Uint8Array, data: Uint8Array) {
    let crc = 0xffffffff;

    for (const byte of type) {
        crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }

    for (const byte of data) {
        crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

function createCrcTable() {
    const table = new Uint32Array(256);

    for (let i = 0; i < table.length; i++) {
        let value = i;

        for (let j = 0; j < 8; j++) {
            value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }

        table[i] = value >>> 0;
    }

    return table;
}
