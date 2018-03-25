var app = (function() {
    var notes = [];

    function processSubmitOfAddNewNoteForm() {
        var form = document.getElementsByClassName('note-add__form')[0];
        var formClassName = form.className;
        form.className = formClassName + " submitted";
        var valid = form.checkValidity();
        
        if (valid) {
            addNote(form);
            //form.submit();
        } else {
            document.getElementsByClassName('note-title__error-message')[0].innerHTML = form['note-add__title-field'].validationMessage;
            document.getElementsByClassName('note-content__error-message')[0].innerHTML = form['note-add__content-field'].validationMessage;
        }
        return false;
    }

    function Note(id, title, content, fillColor, textColor, fontFamily, fontSize) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.fillColor = fillColor;
        this.textColor = textColor;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
    }

    function addNote(form) {
        var id = notes.length;
        var noteTitle = form['note-add__title-field'].value;
        var noteContent = form['note-add__content-field'].value;
        var noteFillColor = form['note-add__fill-color-field'].value;
        var noteTextColor = form['note-add__text-color-field'].value;
        var noteFontFamily = form['note-add__font-family-field'].value;
        var noteFontSize = form['note-add__font-size-field'].value;
        var note = new Note(id, noteTitle, noteContent, noteFillColor, noteTextColor, noteFontFamily, noteFontSize);
        notes.push(note);
        renderNote(note);
    }  
        
    function renderNote(note) {
        var noteElement = getNoteDOMElement(note);
        document.getElementsByClassName('notes')[0].appendChild(noteElement);
    }

    function getNoteDOMElement(note) {
        var noteTemplate =  `
            <div class="note-container note-${note.id}">
                <div class="note" style="background-color:${note.fillColor}; color:${note.textColor};
                                        font-family:${note.fontFamily}, sans-serif; font-size:${note.fontSize}px">
                    <p class="note__title">${note.title}</p>
                    <hr>
                    <p class="note__content">${note.content}</p>
                </div>
                <div class="note__buttons">
                    <button class="note__save-btn" onclick="app.editNote(${note.id})">Edytuj</button>
                    <button onclick="app.deleteNote(${note.id})">Usuń</button>
                </div>
            </div>
        `.trim();
        
        var elem = document.createElement('div');
        elem.innerHTML = noteTemplate;
        return elem.firstChild;
    }

    function editNote(noteId) {
        var noteContainer = document.getElementsByClassName('note-container')[noteId];
        var note = noteContainer.getElementsByClassName('note')[0];
        note.setAttribute('contenteditable', 'true');
        note.focus();
        var editBtn = noteContainer.getElementsByClassName('note__save-btn')[0];
        editBtn.innerHTML = "Zapisz";
        editBtn.removeAttribute('onclick');
        editBtn.setAttribute('onclick', `app.saveEditedNoteChanges(${noteId});`);
    }

    function saveEditedNoteChanges(noteId) {
        var noteContainer = document.getElementsByClassName('note-container')[noteId];    
        var editedNoteTitle = noteContainer.getElementsByClassName('note__title')[0].innerText.trim();
        var editedNoteContent = noteContainer.getElementsByClassName('note__content')[0].innerText.trim();
        var errorMessages = "";

        if (!editedNoteTitle) {
            errorMessages += "Notatka musi posiadać tytuł.\n";
        }

        if (!editedNoteContent) {
            errorMessages += "Notatka nie może być pusta.";
        }

        if (errorMessages) {
            alert(errorMessages);
            return;
        }

        var note = noteContainer.getElementsByClassName('note')[0];
        var editBtn = noteContainer.getElementsByClassName('note__save-btn')[0];

        updateNoteModel(noteId, editedNoteTitle, editedNoteContent);
        note.setAttribute('contenteditable', 'false');
        editBtn.innerHTML = "Edytuj";
        editBtn.removeAttribute('onclick');
        editBtn.setAttribute('onclick', `app.editNote(${noteId});`);
    }

    function deleteNote(noteId) {
        document.getElementsByClassName(`note-${noteId}`)[0].remove();
        for (var i = 0; i < notes.length; i++) {
            if (notes[i].id === noteId) {
                notes.splice(i, 1);
            }
        }
    }

    function updateNoteModel(noteId, noteTitle, noteContent) {
        var note = notes[noteId];
        note.noteTitle = noteTitle;
        note.noteContent = noteContent;
    }

    function countRemainingCharacters(inputCounted, counterClass, maxValue) {
        var charCount = inputCounted.value.length;
        var counter = document.getElementsByClassName(counterClass)[0];
        var remainingCharsNum = maxValue - charCount;
        var counterText = counter.innerText.split(':')[0] + ": " + remainingCharsNum;
        counter.innerText = counterText;
    }

    return {
            processSubmitOfAddNewNoteForm: processSubmitOfAddNewNoteForm,
            editNote: editNote,
            saveEditedNoteChanges: saveEditedNoteChanges,
            deleteNote: deleteNote,
            countRemainingCharacters: countRemainingCharacters
        };
})();