import React from "react";
import { render, screen } from "@testing-library/react";

import TaskRemindersPage from "../TaskRemindersPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders taskReminders page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TaskRemindersPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("taskReminders-datatable")).toBeInTheDocument();
    expect(screen.getByRole("taskReminders-add-button")).toBeInTheDocument();
});
