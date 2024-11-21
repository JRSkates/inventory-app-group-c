import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import App from "../components/App";

// beforeEach(() => {
//   global.fetch = jest.fn(() =>
//     Promise.resolve({
//       json: () =>
//         Promise.resolve([
//           { id: 1, name: "Item 1", description: "Description 1", price: 10, category: "Category 1", image: "item1.jpg" },
//           { id: 2, name: "Item 2", description: "Description 2", price: 20, category: "Category 2", image: "item2.jpg" },
//         ]),
//     })
//   );
// });

beforeEach(() => {
  jest.restoreAllMocks();
});

test("renders the app header", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: "Item 1", description: "Description 1", price: 10, category: "Category 1", image: "item1.jpg" },
          { id: 2, name: "Item 2", description: "Description 2", price: 20, category: "Category 2", image: "item2.jpg" },
        ]),
    })
  );

  // Use `act` to wrap rendering and ensure all updates are processed
  await act(async () => {
    render(<App />);
  });

  // Assert the header is rendered
  expect(screen.getByText(/Inventory App/i)).toBeInTheDocument();
});

test("renders the list of items", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: "Item 1", description: "Description 1", price: 10, category: "Category 1", image: "item1.jpg" },
          { id: 2, name: "Item 2", description: "Description 2", price: 20, category: "Category 2", image: "item2.jpg" },
        ]),
    })
  );

  await act(async () => {
    render(<App />);
  });

  // Verify that items are rendered
  expect(screen.getByText("Item 1")).toBeInTheDocument();
  expect(screen.getByText("Item 2")).toBeInTheDocument();
});


test("adds a new item and displays it in the list", async () => {
  // Mock the initial GET request for the items list
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: "Item 1", description: "Description 1", price: 10, category: "Category 1", image: "item1.jpg" },
          { id: 2, name: "Item 2", description: "Description 2", price: 20, category: "Category 2", image: "item2.jpg" },
        ]),
    })
  );

  // Mock the POST request to add a new item
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true }) // Simulate a successful POST response
  );

  // Mock the subsequent GET request to include the new item
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: "Item 1", description: "Description 1", price: 10, category: "Category 1", image: "item1.jpg" },
          { id: 2, name: "Item 2", description: "Description 2", price: 20, category: "Category 2", image: "item2.jpg" },
          { id: 3, name: "New Item", description: "New Description", price: 20, category: "Category 2", image: "item2.jpg" },
        ]),
    })
  );

  // Render the component
  await act(async () => {
    render(<App />);
  });

  // Ensure initial items are displayed
  expect(screen.getByText("Item 1")).toBeInTheDocument();
  expect(screen.getByText("Item 2")).toBeInTheDocument();

  // Click "Add New Item" button
  const addButton = screen.getByText("Add New Item");
  fireEvent.click(addButton);

  // Fill out the form
  fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "New Item" } });
  fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "New Description" } });
  fireEvent.change(screen.getByLabelText("Price:"), { target: { value: "20" } });
  fireEvent.change(screen.getByLabelText("Category:"), { target: { value: "Category 2" } });
  fireEvent.change(screen.getByLabelText("Image URL:"), { target: { value: "item2.jpg" } });

  // Submit the form
  const submitButton = screen.getByText("Submit");
  await act(async () => {
    fireEvent.click(submitButton);
  });

  await act(async () => {
    render(<App />);
  });

  // Assert that the new item appears in the list
  expect(screen.getByText("New Item")).toBeInTheDocument();
});




