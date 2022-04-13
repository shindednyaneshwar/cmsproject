import mongoose from "mongoose";
const DepartwiseSubject = mongoose.Schema({

    deptname: String,
    first: [Object],
     second: [Object],
     third: [Object],
     fourth: [Object],
     fifth: [Object],
     sixth: [Object],
     seventh: [Object],
     eighth: [Object]

})

export const DepartwiseSubjectModel = mongoose.model('DepartwiseSubject', DepartwiseSubject);

export default DepartwiseSubjectModel