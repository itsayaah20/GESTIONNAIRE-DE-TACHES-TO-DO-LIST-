document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Charger les tâches depuis le serveur lorsque la page est chargée
    loadTasks();

    // Ajouter une tâche lorsque l'utilisateur clique sur le bouton "Ajouter"
    addTaskBtn.addEventListener('click', function () {
        const taskDescription = taskInput.value.trim();
        if (taskDescription !== '') {
            // Envoyer la nouvelle tâche au serveur
            addTask(taskDescription);
            taskInput.value = ''; // Vider le champ de saisie
        }
    });

    // Fonction pour charger toutes les tâches
    function loadTasks() {
        fetch('http://localhost:3000/tasks') // Requête pour obtenir les tâches
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = ''; // Vider la liste avant d'ajouter de nouvelles tâches
                tasks.forEach(task => {
                    displayTask(task);
                });
            })
            .catch(error => {
                console.error('Erreur de chargement des tâches:', error);
            });
    }

    // Fonction pour afficher une tâche dans la liste
    function displayTask(task) {
        const li = document.createElement('li');
        li.id = task.id;

        const taskDescription = document.createElement('span');
        taskDescription.textContent = task.description;
        if (task.completed) {
            taskDescription.classList.add('completed');
        }

        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Non terminée' : 'Terminée';
        completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id, !task.completed));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(taskDescription);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    // Fonction pour ajouter une nouvelle tâche
    function addTask(description) {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: description })
        })
        .then(response => response.json())
        .then(task => {
            displayTask(task); // Afficher la tâche ajoutée dans la liste
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
        });
    }

    // Fonction pour marquer une tâche comme terminée ou non terminée
    function toggleTaskCompletion(taskId, completed) {
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: completed })
        })
        .then(response => response.json())
        .then(() => {
            loadTasks(); // Recharger les tâches après modification
        })
        .catch(error => {
            console.error('Erreur de mise à jour de la tâche:', error);
        });
    }

    // Fonction pour supprimer une tâche
    function deleteTask(taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadTasks(); // Recharger les tâches après suppression
        })
        .catch(error => {
            console.error('Erreur de suppression de la tâche:', error);
        });
    }
    // Route pour supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    
    // Requête SQL pour supprimer la tâche par son ID
    const query = 'DELETE FROM tasks WHERE id = ?';
    
    db.query(query, [taskId], (err, result) => {
        if (err) {
            // Si une erreur survient, renvoyez un message d'erreur
            res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
        } else {
            // Si la tâche est supprimée avec succès, renvoyez un message de succès
            res.json({ message: 'Tâche supprimée avec succès' });
        }
    });
});
// Fonction pour supprimer une tâche
function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Affiche un message de succès ou d'erreur
        loadTasks(); // Recharger les tâches après suppression
    })
    .catch(error => {
        console.error('Erreur de suppression de la tâche:', error);
    });
}

});
