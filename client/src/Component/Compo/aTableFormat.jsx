import "./TableFormat.css"
export default function TableFormat(props) {




    var table_head = ["Subject Name", "Faculty", "Total Present", "Attendance"];
    var table_details = ["science", "PANHJ", "122", "100%"];
    // var operation = [ "delete", "edit", "upload"] ;
    var operation = props.operation || [];

    const lastCol = props.colNmae || "";

    

 
    return (

        <>
            <div className="cms-table">

                <table className="table table_striped">
                    <thead className="bg-light">
                        <tr>
                            {/* <button onClick={check}></button> */}
                            {props.table_head.map((item, index) => {
                                return (
                                    <>
                                        <th scope="col" key={index}> {item}</th>

                                    </>
                                )
                            })}
                            {/* {
                                operation.length ? <th scope="col"> {lastCol}</th> : ""

                            } */}
                        </tr>
                    </thead>
                    <tbody>

                        {props.table_details.map((item, index) => {
                            {/* console.log(item); */}
                            return (
                                
                                <>
                              
                                    <tr>

                                        {item.map((intItem, intIndex) => {
                                            {/* console.log(intItem) */}
                                            return (
                                                <>
                                                    <td scope="col" key={intIndex} > {intItem}</td>
                                                </>
                                            )
                                        })}


                                    </tr>
                                </>
                            )
                        })}

                        {/* {
                                operation.length ?
                                    <>

                                        <td>
                                            {operation.includes("edit") ? <a id="edit" htmlFor="edit" onClick={(e) => changeHandler(e)}><i id="edit" class="bi bi-pencil-square"></i></a> : ""}
                                            {operation.includes("delete") ? <a id="delete" htmlFor="delete" onClick={(e) => changeHandler(e)}><i id="delete" class="bi bi-trash-fill"></i></a> : ""}
                                            {operation.includes("upload") ? <a id="upload" htmlFor="upload" onClick={(e) => changeHandler(e)}><i id="upload" class="bi bi-cloud-upload-fill"></i></a> : ""}
                                        </td>

                                    </> : ""
                            } */}

                    </tbody>
                </table>
            </div>
        </>
    )

}

