import mongooso from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
    try {
        const connection = await mongooso.connect(process.env.MONGO_URI);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(colors.cyan(`Mongo DB connected: ${url}`));
    } catch (error) {
        console.error(colors.bgRed.white(`Error: ${error.message}`));
        process.exit(1);
    }
};