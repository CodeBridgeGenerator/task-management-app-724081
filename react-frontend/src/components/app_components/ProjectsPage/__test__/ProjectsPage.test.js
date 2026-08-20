import React from "react";
import { render, screen } from "@testing-library/react";

import ProjectsPage from "../ProjectsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders projects page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProjectsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("projects-datatable")).toBeInTheDocument();
    expect(screen.getByRole("projects-add-button")).toBeInTheDocument();
});
