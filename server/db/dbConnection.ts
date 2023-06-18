import mongoose from "mongoose"

const connect = async (mongoURI: string) => {
    await mongoose.connect(mongoURI);
}

export default connect;