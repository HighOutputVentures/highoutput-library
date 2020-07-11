"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateSnapshotId(aggregate) {
    const id = Buffer.allocUnsafe(22);
    aggregate.id.copy(id, 0);
    id.writeUIntBE(aggregate.version, 16, 6);
    return id;
}
exports.default = generateSnapshotId;
//# sourceMappingURL=generate-snapshot-id.js.map