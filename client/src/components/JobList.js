//Imports used
import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form,
    FilterRow,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
//Search Filter Addition
const applyFilterTypes = [
    {
        key: 'auto',
        name: 'Immediately',
    },
    {
        key: 'onClick',
        name: 'On Button Click',
    },
];
//Main JobList Function
function JobList() {
    //setting default values
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const showFilterRow = React.useState(true);
    const currentFilter = React.useState(applyFilterTypes[0].key);
    const [items, setItems] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const editingModeID = useRef(0);
    //statuses ID Array
    const status = [
        {
            ID: "submitted",
            Name: "Submitted",
        },
        {
            ID: "progress",
            Name: "In progress",
        },
        {
            ID: "completed",
            Name: "Completed",
        },
    ];
    //priority ID Array
    const priority = [
        {
            ID: "Low",
            Name: "Low",
        },
        {
            ID: "Medium",
            Name: "Medium",
        },
        {
            ID: "High",
            Name: "High",
        },
    ];
    //archived ID Array
    const archived = [
        {
            ID: "true",
            Name: "true",
        },
        {
            ID: "false",
            Name: "false",
        },
    ];
    //useEffect Method
    useEffect(() => {
        //Fetching Available Jobs from Server (non-archived)
        fetch("/availableJobs")
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }, []);
    //function on saving a Jobs details
    const onSaving = (e) => {
        if (e.changes[0].type === "remove") {
            //Used to Archive a specific job
            const job = { id: e.changes[0].key };
            fetch("/archiveJob", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job),
            }).then(() => {
                //Resetting values of editingMode to be re-used
                editingModeID.current = 0;
                window.location.href = "/";
            });
        } else {
            //Update or add new job
            const jobs = e.changes;
            //When the Job has data
            if (jobs.length !== 0) {
                //ForEach Loop through the jobs fields
                jobs.forEach((element, i) => {
                    const job = {
                        description: element.data.description,
                        location: element.data.location,
                        priority: element.data.priority,
                        status: element.data.status,
                    };
                    //For Updating an existing job
                    if (e.changes[0].type === "update") {
                        //Getting the Id of the Specific Job 
                        job.id = element.key ? element.key : editingModeID.current;
                        //Send UpdateJob Route to the server
                        fetch("/updateJob", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(job),
                        }).then(() => {
                            //Resetting values of editingMode for re-use
                            editingModeID.current = 0;
                        });
                    } else {
                        //For Adding a new job
                        fetch("/addNewJob", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(job),
                        }).then(() => {
                        });
                    }
                });
                //Back to the Home Page
                window.location.href = "/";
            }
        }
    };
    //Function on Getting All Job data 
    function loadModalData() {
        fetch("/allJobs")
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setAllJobs(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }
    return (
        <>
            <h4>Currently Available Jobs:</h4>
            {/*For Main Data grid Table and an add/edit forms for a single Job, when using the Delete button it will Archive a Job Not remove it completely*/}
            <div id="data-grid-demo">
                <DataGrid
                    dataSource={items}
                    keyExpr="_id"
                    showBorders={true}
                    onSaving={onSaving}
                >{/*Filter jobs by status can be aquired by using the dropdown in the filter Row*/}
                    <FilterRow
                        visible={showFilterRow}
                        applyFilter={currentFilter}
                    />
                    <Paging defaultPageSize={10} />
                    <Editing
                        mode="popup"
                        allowUpdating={true}
                        allowAdding={true}
                        allowDeleting={true}
                    >
                        <Popup title="Submit Job Details" showTitle={true} width={850} height={260} />
                        <Form>
                            <Item itemType="group" colCount={2} colSpan={2}>
                                <Item dataField="description" />
                                <Item dataField="location" />
                                <Item dataField="priority" />
                                <Item dataField="status" />
                            </Item>
                        </Form>
                    </Editing>
                    {/*Jobs by default(on referesh) are ordered date submitted but ordering by Job status can be by aquired clicking the "Job Status" Grid Header*/}
                    <Column dataField="_id" caption="Job Id" width={70} />
                    <Column dataField="description" width={300} caption="Job Description" />
                    <Column dataField="location" caption="Job Location" />
                    <Column dataField="status" caption="Job Status">
                        <Lookup dataSource={status} displayExpr="Name" valueExpr="ID" />
                    </Column>
                    <Column dataField="priority" caption="Job Priority">
                        <Lookup dataSource={priority} displayExpr="Name" valueExpr="ID" />
                    </Column>
                </DataGrid>
            </div>
            {/*For batch update, this also is used to unArchive a Job (sometimes it fails to update all fields changed if there are more than 5 changes)*/}
            <div
                className="d-inline-flex gap-2 mb-5 mt-5"
                style={{ marginLeft: "43%" }}
            >
                <button
                    type="button"
                    className="d-inline-flex align-items-center btn btn-warning btn-lg px-4"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalFullscreen"
                    onClick={() => loadModalData()}
                >
                    Batch Update
                </button>
            </div>
            <div
                className="modal fade"
                id="exampleModalFullscreen"
                tabIndex="-1"
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-4" id="exampleModalFullscreenLabel">
                                JobList Batch Update
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div id="data-grid-demo">
                                <DataGrid
                                    dataSource={allJobs}
                                    keyExpr="_id"
                                    showBorders={true}
                                    onSaving={onSaving}
                                >
                                    <Paging defaultPageSize={10} />
                                    <Editing
                                        mode="batch"
                                        allowUpdating={true}
                                    />
                                    <Column dataField="_id"  caption="Job Id" width={70} />
                                    <Column dataField="description" width={170}  caption="Job Description"/>
                                    <Column dataField="location"  caption="Job Location"/>
                                    <Column dataField="archived" caption="Is Job Archived">
                                        <Lookup
                                            dataSource={archived}
                                            displayExpr="Name"
                                            valueExpr="ID"
                                        />
                                    </Column>
                                    <Column dataField="status" caption="Job Status">
                                        <Lookup
                                            dataSource={status}
                                            displayExpr="Name"
                                            valueExpr="ID"
                                        />
                                    </Column>
                                    <Column dataField="priority" caption="Job Priority">
                                        <Lookup
                                            dataSource={priority}
                                            displayExpr="Name"
                                            valueExpr="ID"
                                        />
                                    </Column>
                                </DataGrid>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default JobList;