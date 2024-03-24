import { AddSongRowButton, Modal, RemoveSongRowButton, RequiredFields, Songs, SubmitButton } from "./Form";
import { fireEvent, render, screen } from "@testing-library/react";

import React from "react";
import userEvent from "@testing-library/user-event";

describe("RequiredFields", () => {
	const genres = ["Action", "Comedy", "Drama"];
	const isLoading = false;
	const genresAreLoading = false;

	it("should render the Name input field", () => {
		render(<RequiredFields genres={genres} genresAreLoading={genresAreLoading} isLoading={isLoading} control={{}} />);

		const nameInput = screen.getByLabelText("Name");
		expect(nameInput).toBeInTheDocument();
	});

	it("should render the Genre select field", () => {
		render(<RequiredFields genres={genres} genresAreLoading={genresAreLoading} isLoading={isLoading} control={{}} />);

		const genreSelect = screen.getByLabelText("Genre");
		expect(genreSelect).toBeInTheDocument();
	});

	it("should display an error message when Name is not provided", () => {
		render(<RequiredFields genres={genres} genresAreLoading={genresAreLoading} isLoading={isLoading} control={{}} />);

		const nameInput = screen.getByLabelText("Name");
		userEvent.clear(nameInput);
		userEvent.tab();

		const errorMessage = screen.getByText("Name is required.");
		expect(errorMessage).toBeInTheDocument();
	});

	it("should display an error message when Genre is not selected", () => {
		render(<RequiredFields genres={genres} genresAreLoading={genresAreLoading} isLoading={isLoading} control={{}} />);

		const genreSelect = screen.getByLabelText("Genre");
		userEvent.selectOptions(genreSelect, "");
		userEvent.tab();

		const errorMessage = screen.getByText("Genre is required.");
		expect(errorMessage).toBeInTheDocument();
	});
});

describe("RemoveSongRowButton", () => {
	it("should call setSongRows when Remove Song Row button is clicked", () => {
		const setSongRows = jest.fn();
		const songRows = 5;

		render(<RemoveSongRowButton setSongRows={setSongRows} songRows={songRows} />);

		const removeButton = screen.getByText("Remove Song Row");
		fireEvent.click(removeButton);

		expect(setSongRows).toHaveBeenCalledTimes(1);
		expect(setSongRows).toHaveBeenCalledWith(songRows - 1);
	});
});

describe("AddSongRowButton", () => {
	it("should call setSongRows when Add Song Row button is clicked", () => {
		const setSongRows = jest.fn();
		const songRows = 0;

		render(<AddSongRowButton setSongRows={setSongRows} songRows={songRows} />);

		const addSongRowButton = screen.getByTestId("add-song-row-btn");
		fireEvent.click(addSongRowButton);

		expect(setSongRows).toHaveBeenCalledTimes(1);
		expect(setSongRows).toHaveBeenCalledWith(songRows + 1);
	});
});

describe("Modal", () => {
	it("should render the modal body component", () => {
		const setShowModal = jest.fn();
		const blocker = {
			reset: jest.fn(),
			proceed: jest.fn(),
		};

		render(<Modal blocker={blocker} setShowModal={setShowModal} />);

		const modalBody = screen.getByText("Are you sure you want to leave?");
		expect(modalBody).toBeInTheDocument();
	});

	it("should call blocker.reset and setShowModal when modal is closed", () => {
		const setShowModal = jest.fn();
		const blocker = {
			reset: jest.fn(),
			proceed: jest.fn(),
		};

		render(<Modal blocker={blocker} setShowModal={setShowModal} />);

		const closeButton = screen.getByLabelText("Close");
		fireEvent.click(closeButton);

		expect(blocker.reset).toHaveBeenCalledTimes(1);
		expect(setShowModal).toHaveBeenCalledTimes(1);
		expect(setShowModal).toHaveBeenCalledWith(false);
	});

	it("should call blocker.proceed when confirm action is triggered", () => {
		const setShowModal = jest.fn();
		const blocker = {
			reset: jest.fn(),
			proceed: jest.fn(),
		};

		render(<Modal blocker={blocker} setShowModal={setShowModal} />);

		const confirmButton = screen.getByLabelText("Confirm");
		fireEvent.click(confirmButton);

		expect(blocker.proceed).toHaveBeenCalledTimes(1);
	});
});

describe("SubmitButton", () => {
	it("should render the button with correct text when online is false", () => {
		render(<SubmitButton isCreateMode={false} isDirty={true} isValid={true} online={false} showLoadingButton={false} />);

		const button = screen.getByText("Offline");
		expect(button).toBeInTheDocument();
	});

	it("should render the button with correct text when isCreateMode is true", () => {
		render(<SubmitButton isCreateMode={true} isDirty={true} isValid={true} online={true} showLoadingButton={false} />);

		const button = screen.getByText("Create");
		expect(button).toBeInTheDocument();
	});

	it("should render the button with correct text when isCreateMode is false", () => {
		render(<SubmitButton isCreateMode={false} isDirty={true} isValid={true} online={true} showLoadingButton={false} />);

		const button = screen.getByText("Save");
		expect(button).toBeInTheDocument();
	});

	it("should disable the button when online is false", () => {
		render(<SubmitButton isCreateMode={false} isDirty={true} isValid={true} online={false} showLoadingButton={false} />);

		const button = screen.getByText("Offline");
		expect(button).toBeDisabled();
	});

	it("should disable the button when isDirty is false", () => {
		render(<SubmitButton isCreateMode={false} isDirty={false} isValid={true} online={true} showLoadingButton={false} />);

		const button = screen.getByText("Save");
		expect(button).toBeDisabled();
	});

	it("should disable the button when isValid is false", () => {
		render(<SubmitButton isCreateMode={false} isDirty={true} isValid={false} online={true} showLoadingButton={false} />);

		const button = screen.getByText("Save");
		expect(button).toBeDisabled();
	});

	it("should enable the button when all conditions are met", () => {
		render(<SubmitButton isCreateMode={false} isDirty={true} isValid={true} online={true} showLoadingButton={false} />);

		const button = screen.getByText("Save");
		expect(button).not.toBeDisabled();
	});
});

describe("Songs", () => {
	const isLoading = false;
	const control = {};
	const songRows = 3;

	it("should render the correct number of song rows", () => {
		render(<Songs isLoading={isLoading} control={control} songRows={songRows} />);

		const songRowElements = screen.getAllByRole("grid");
		expect(songRowElements).toHaveLength(songRows);
	});

	it("should render the correct input fields within each song row", () => {
		render(<Songs isLoading={isLoading} control={control} songRows={songRows} />);

		const titleInputs = screen.getAllByLabelText("Title");
		const artistInputs = screen.getAllByLabelText("Artist");

		expect(titleInputs).toHaveLength(songRows);
		expect(artistInputs).toHaveLength(songRows);
	});

	// Add more test cases as needed
});
