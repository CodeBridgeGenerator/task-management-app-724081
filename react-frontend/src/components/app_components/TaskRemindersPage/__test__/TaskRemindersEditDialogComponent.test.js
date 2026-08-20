import React from "react";
import { render, screen } from "@testing-library/react";

import TaskRemindersEditDialogComponent from "../TaskRemindersEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders taskReminders edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TaskRemindersEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("taskReminders-edit-dialog-component")).toBeInTheDocument();
});
