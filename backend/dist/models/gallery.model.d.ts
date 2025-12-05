import mongoose, { Document } from "mongoose";
export interface IGalleryImage extends Document {
    vendorId: string;
    url: string;
    title?: string;
    description?: string;
    mediaType?: "image" | "video";
    uploadedAt: Date;
    updatedAt: Date;
}
export interface IGallery extends Document {
    vendorId: string;
    images: IGalleryImage[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Gallery: mongoose.Model<IGallery, {}, {}, {}, mongoose.Document<unknown, {}, IGallery, {}, {}> & IGallery & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Gallery;
//# sourceMappingURL=gallery.model.d.ts.map