const  noteForm =  document.getElementById("noteForm");
const noteInput =  document.getElementById("noteInput");
const  notesList = document.getElementById("notesList");
const notesCounter = document.getElementById("notesCounter");
const   clearAllButton = document.getElementById("clearAllButton");
const  addButton = document.getElementById("addButton");
const saveChangesButton =    document.getElementById("saveChangesButton");
const copyToast = document.getElementById("copyToast"); 
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = -1;
renderNotes();

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const noteText = noteInput.value.trim();
    if (noteText === "") return;

    if (editIndex > -1) {
        notes[editIndex].text = noteText;
        notes[editIndex].time = new Date().toLocaleString(); 
        editIndex = -1;
        saveChangesButton.classList.add("hidden");
        addButton.classList.remove("hidden");
    } else {
       
        notes.push({ text: noteText, time: new Date().toLocaleString() });
    }
    noteInput.value = "";
    saveNotesToLocalStorage();
    renderNotes();
});
saveChangesButton.addEventListener("click", () => {
    if (editIndex > -1) {
        const noteText = noteInput.value.trim();
        if (noteText === "") return;

        notes[editIndex].text = noteText;
        notes[editIndex].time = new Date().toLocaleString();
        editIndex = -1;
        noteInput.value = "";
        saveChangesButton.classList.add("hidden");
        addButton.classList.remove("hidden");
 saveNotesToLocalStorage();
        renderNotes();
    }
});
function renderNotes() {
    notesList.innerHTML = "";
    notes.forEach((note, index) => {
    const noteItem = document.createElement("li");
        noteItem.innerHTML = `
            <span class="note-number">${index + 1}.</span>
        <div class="note-content">
                <p>${note.text}</p>
                <span class="note-time">${note.time}</span>
            </div>
          <button class="edit-button"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
            <button class="copy-button"><i class="fa-solid fa-copy"></i></button>
        `;

        const editButton = noteItem.querySelector(".edit-button");
        const deleteButton = noteItem.querySelector(".delete-button");
        const copyButton = noteItem.querySelector(".copy-button");
        editButton.addEventListener("click", () => {
     noteInput.value = note.text;
            editIndex = index;
         saveChangesButton.classList.remove("hidden");
            addButton.classList.add("hidden");
        });
        deleteButton.addEventListener("click", () => {
            noteItem.classList.add("deleted"); 
         setTimeout(() => {
                notes.splice(index, 1); 
                saveNotesToLocalStorage(); 
                renderNotes(); 
            }, 500); 
        });
 copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(note.text)
                .then(() => {
                    showCopyToast(); 
                })
                .catch((err) => {
                    console.error("Error copying text: ", err);
                }
                      );
        });
notesList.appendChild(noteItem);
    });
  notesCounter.textContent = `Loaded Ideas: ${notes.length}`;
}

   clearAllButton.addEventListener("click", () => {
    notes = [];
       saveNotesToLocalStorage();
    renderNotes();
});function showCopyToast() {
  const copyToast = document.getElementById("copyToast");
  copyToast.classList.add("show");

  setTimeout(() => {
      copyToast.classList.remove("show");
  }, 3000);
}
function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}
