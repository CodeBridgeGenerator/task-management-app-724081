/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
const statusOptions = [];
const priorityOptions = [];

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const TasksEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [project, setProject] = useState([])
const [assignee, setAssignee] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount projects
                    client
                        .service("projects")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProjectsId } })
                        .then((res) => {
                            setProject(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Projects", type: "error", message: error.message || "Failed get projects" });
                        });
                }, []);
 useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setAssignee(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            title: _entity?.title,
description: _entity?.description,
status: _entity?.status,
priority: _entity?.priority,
project: _entity?.project?._id,
assignee: _entity?.assignee?._id,
dueDate: _entity?.dueDate,
        };

        setLoading(true);
        try {
            
        await client.service("tasks").patch(_entity._id, _data);
        const eagerResult = await client
            .service("tasks")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "project",
                    service : "projects",
                    select:["name"]},{
                    path : "assignee",
                    service : "users",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info tasks updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const projectOptions = project.map((elem) => ({ name: elem.name, value: elem.value }));
const assigneeOptions = assignee.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Tasks" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="tasks-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="title">Title:</label>
                <InputText id="title" className="w-full mb-3 p-inputtext-sm" value={_entity?.title} onChange={(e) => setValByKey("title", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["title"]) && (
              <p className="m-0" key="error-title">
                {error["title"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">Description:</label>
                <InputTextarea id="description" rows={5} cols={30} value={_entity?.description} onChange={ (e) => setValByKey("description", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["description"]) && (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="status">Status:</label>
                <Dropdown id="status" value={_entity?.status} options={statusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("status", e.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["status"]) && (
              <p className="m-0" key="error-status">
                {error["status"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="priority">Priority:</label>
                <Dropdown id="priority" value={_entity?.priority} options={priorityOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("priority", e.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["priority"]) && (
              <p className="m-0" key="error-priority">
                {error["priority"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="project">Project:</label>
                <Dropdown id="project" value={_entity?.project?._id} optionLabel="name" optionValue="value" options={projectOptions} onChange={(e) => setValByKey("project", {_id : e.value})}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["project"]) && (
              <p className="m-0" key="error-project">
                {error["project"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="assignee">Assignee:</label>
                <Dropdown id="assignee" value={_entity?.assignee?._id} optionLabel="name" optionValue="value" options={assigneeOptions} onChange={(e) => setValByKey("assignee", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["assignee"]) && (
              <p className="m-0" key="error-assignee">
                {error["assignee"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="dueDate">Due Date:</label>
                <InputText id="dueDate" className="w-full mb-3 p-inputtext-sm" value={_entity?.dueDate} onChange={(e) => setValByKey("dueDate", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["dueDate"]) && (
              <p className="m-0" key="error-dueDate">
                {error["dueDate"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(TasksEditDialogComponent);
