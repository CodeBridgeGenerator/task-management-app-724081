import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const TaskRemindersCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [task, setTask] = useState([])

    useEffect(() => {
        let init  = {isSent: false};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [task], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.task)) {
                error["task"] = `Task field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.remindAt)) {
                error["remindAt"] = `Remind At field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            task: _entity?.task?._id,remindAt: _entity?.remindAt,isSent: _entity?.isSent || false,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("taskReminders").create(_data);
        const eagerResult = await client
            .service("taskReminders")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "task",
                    service : "tasks",
                    select:["title"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Task Reminders updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Task Reminders" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount tasks
                    client
                        .service("tasks")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleTasksId } })
                        .then((res) => {
                            setTask(res.data.map((e) => { return { name: e['title'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Tasks", type: "error", message: error.message || "Failed get tasks" });
                        });
                }, []);

    
    
    

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

    const taskOptions = task.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Task Reminders" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="taskReminders-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="task">Task:</label>
                <Dropdown id="task" value={_entity?.task?._id} optionLabel="name" optionValue="value" options={taskOptions} onChange={(e) => setValByKey("task", {_id : e.value})}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["task"]) ? (
              <p className="m-0" key="error-task">
                {error["task"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="remindAt">Remind At:</label>
                <InputText id="remindAt" className="w-full mb-3 p-inputtext-sm" value={_entity?.remindAt} onChange={(e) => setValByKey("remindAt", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["remindAt"]) ? (
              <p className="m-0" key="error-remindAt">
                {error["remindAt"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field flex">
            <span className="align-items-center">
                <label htmlFor="isSent">Sent:</label>
                <InputText id="isSent" className="w-full mb-3 p-inputtext-sm" value={_entity?.isSent} onChange={(e) => setValByKey("isSent", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["isSent"]) ? (
              <p className="m-0" key="error-isSent">
                {error["isSent"]}
              </p>
            ) : null}
          </small>
            </div>
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

export default connect(mapState, mapDispatch)(TaskRemindersCreateDialogComponent);
