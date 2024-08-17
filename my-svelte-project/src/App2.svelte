<script>
/////////////////////////////client/////////////////////////////
/////////////////////////////client/////////////////////////////
/////////////////////////////client/////////////////////////////
let canvas;
    let ctx;
    let base64Image;
    let drawing = false;
    const undoStack = [];

    function startDrawing(e) {
        drawing = true;
        saveState();
        ctx.beginPath(); // Begin a new path to avoid connecting lines
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath(); // Begin a new path to avoid connecting lines
    }

    function draw(e) {
        if (!drawing) return;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function saveState() {
        undoStack.push(canvas.toDataURL());
    }

    function undo() {
        if (undoStack.length > 0) {
            const previousState = undoStack.pop();
            const img = new Image();
            img.src = previousState;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function exportImage() {
        base64Image = canvas.toDataURL('image/png');
        alert('Base64 Image Data URL has been saved to the global variable `base64Image`.');
        console.log(base64Image); // Optional: View the Base64 string in the console
    }


/////////////////////////////client/////////////////////////////
/////////////////////////////client/////////////////////////////
/////////////////////////////client/////////////////////////////









{
/////////////////////////////server_express.js/////////////////////////////
/////////////////////////////server_express.js/////////////////////////////
/////////////////////////////server_express.js/////////////////////////////

/////////////////////////////AI/////////////////////////////
// 以下のコードを以下のルールで書き換えて
// pop_up_url => app3
// url_name => app3_title TEXT not nullで1文字以上100文字以下
// url_list => app3_base64 TEXT not null 500kb以下
/////////////////////////////AI/////////////////////////////

//  const db_for_app3 = new sqlite('app3.db');
//  
//  const initializeDatabase_app3 = () => {
//      db_for_app3.exec('DROP TABLE IF EXISTS app3');
//      db_for_app3.exec(`
//          CREATE TABLE app3 (
//              id INTEGER PRIMARY KEY AUTOINCREMENT,
//              uid TEXT NOT NULL CHECK(length(uid) >= 1 AND length(uid) <= 3000),
//              app3_title TEXT NOT NULL CHECK(length(app3_title) >= 1 AND length(app3_title) <= 100),
//              app3_base64 TEXT NOT NULL CHECK(length(app3_base64) <= 500000),
//              created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//              updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//          );
//      `);
//  };
//  initializeDatabase_app3();
//  
//  app.post('/app3/init-database', (req, res) => {
//      const { password } = req.body;
//  
//      if (password === 'init') {
//          try {
//              initializeDatabase_app3();
//              res.status(200).json({ message: 'Database initialized successfully.' });
//          } catch (error) {
//              res.status(500).json({ error: 'Failed to initialize database.' });
//          }
//      } else {
//          res.status(403).json({ error: 'Unauthorized: Invalid password.' });
//      }
//  });
//  
//  app.post('/app3/create', (req, res) => {
//      const { uid, app3_title, app3_base64 } = req.body;
//  
//      if (typeof uid !== 'string' || uid.length < 1 || uid.length > 3000) {
//          return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 3000 characters.' });
//      }
//  
//      if (typeof app3_title !== 'string' || app3_title.length < 1 || app3_title.length > 100) {
//          return res.status(400).json({ error: 'Invalid app3_title. It must be a string between 1 and 100 characters.' });
//      }
//  
//      if (typeof app3_base64 !== 'string' || app3_base64.length > 500000) {
//          return res.status(400).json({ error: 'Invalid app3_base64. It must be a string up to 500kb in size.' });
//      }
//  
//      const stmt = db_for_app3.prepare('INSERT INTO app3 (uid, app3_title, app3_base64) VALUES (?, ?, ?)');
//      const result = stmt.run(uid, app3_title, app3_base64);
//  
//      return res.status(201).json({
//          id: result.lastInsertRowid,
//          uid,
//          app3_title,
//          app3_base64,
//          created: new Date().toISOString(),
//          updated: new Date().toISOString()
//      });
//  });
//  
//  app.post('/app3/read', (req, res) => {
//      const { uid } = req.body;
//  
//      try {
//          const stmt_all = db_for_app3.prepare('SELECT * FROM app3');
//          const all_json = stmt_all.all();
//  
//          if (uid) {
//              const stmt_uid = db_for_app3.prepare('SELECT * FROM app3 WHERE uid = ?');
//              const uid_json = stmt_uid.all(uid);
//              res.status(200).json({ uid_json, all_json });
//          } else {
//              res.status(200).json({ all_json });
//          }
//      } catch (error) {
//          res.status(500).json({ error: 'Failed to retrieve records.' });
//      }
//  });
//  
//  app.post('/app3/update', (req, res) => {
//      const { id, uid, app3_title, app3_base64 } = req.body;
//  
//      if (typeof id !== 'number' || typeof uid !== 'string' || uid.length < 1 || uid.length > 3000 ||
//          typeof app3_title !== 'string' || app3_title.length < 1 || app3_title.length > 100 ||
//          typeof app3_base64 !== 'string' || app3_base64.length > 500000) {
//          return res.status(400).json({ error: 'Invalid input.' });
//      }
//  
//      const stmt = db_for_app3.prepare('UPDATE app3 SET app3_title = ?, app3_base64 = ?, updated = CURRENT_TIMESTAMP WHERE id = ? AND uid = ?');
//      const result = stmt.run(app3_title, app3_base64, id, uid);
//  
//      if (result.changes > 0) {
//          res.status(200).json({ message: 'Record updated successfully.' });
//      } else {
//          res.status(404).json({ error: 'Record not found or UID mismatch.' });
//      }
//  });
//  
//  app.post('/app3/delete', (req, res) => {
//      const { id, uid } = req.body;
//  
//      if (typeof id !== 'number' || typeof uid !== 'string') {
//          return res.status(400).json({ error: 'Invalid input.' });
//      }
//  
//      const stmt = db_for_app3.prepare('DELETE FROM app3 WHERE id = ? AND uid = ?');
//      const result = stmt.run(id, uid);
//  
//      if (result.changes > 0) {
//          res.status(200).json({ message: 'Record deleted successfully.' });
//      } else {
//          res.status(404).json({ error: 'Record not found or UID mismatch.' });
//      }
//  });


/////////////////////////////server_express.js/////////////////////////////
/////////////////////////////server_express.js/////////////////////////////
/////////////////////////////server_express.js/////////////////////////////
};



/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
let url_name = 'GAFAM';
let url_list = `https://www.google.com
https://www.amazon.com
https://www.apple.com
https://www.microsoft.com
https://www.facebook.com`;
let convert_data_0 = null;
let convert_data_1 = null;
// convert_dataの引数の初期値をurl_name, url_listに設定
function convert_data(data_0 = url_name, data_1 = url_list) {
	convert_data_0 = data_0;
	convert_data_1 = data_1;
}
const service_name = 'Pop Up URL';





import { onMount } from 'svelte';
    const firebase_config = {
        apiKey: "AIzaSyBcOlIDP2KWbJuKM0WeMHNp-WvjTVfLt9Y",
        authDomain: "p2auth-ea50a.firebaseapp.com",
        projectId: "p2auth-ea50a",
        storageBucket: "p2auth-ea50a.appspot.com",
        messagingSenderId: "796225429484",
        appId: "1:796225429484:web:ece56ef2fc0be28cd6eac9"
    };
    firebase.initializeApp(firebase_config);
    const google_provider = new firebase.auth.GoogleAuthProvider();
	let error_message = '';
	let user = null;
    let uid = "";
    let login_result = 'Not logged in';
    let web_data = [];

    function check_login() {
        firebase.auth().onAuthStateChanged(current_user => {
            user = current_user;
            if (user) {
                login_result = `Logged in as: ${user.displayName}`;
                uid = user.uid;
                fetch_data(); // Refresh the data
            } else {
                login_result = 'Not logged in';
                uid = "";
            }
        });
    }

    function google_login() {
        firebase.auth().signInWithPopup(google_provider).then(result => {
            user = result.user;
            login_result = `Logged in as: ${user.displayName}`;
        }).catch(error => {
            console.error('Error during Google login:', error);
            alert('Google login failed. ' + error.message);
        });
    }

    function sign_out() {
        firebase.auth().signOut().then(() => {
            user = null;
            login_result = 'Not logged in';
        }).catch(error => {
            console.error('Error during sign-out:', error);
            alert('Sign out failed. ' + error.message);
        });
    }

    async function fetch_data() {
        try {
			console.log('fetch_data');
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/pop_up_url/read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });
            const data = await response.json();
            web_data = data.all_json;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function create_record() {
        try {
			convert_data(url_name, url_list);
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/pop_up_url/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
					uid: uid,
					url_name: convert_data_0,
					url_list: convert_data_1,
				})
            });
            const data = await response.json();
            console.log('Record created:', data);
            fetch_data(); // Refresh the data
        } catch (error) {
            console.error('Error creating record:', error);
        }
    }

    async function update_record(id) {
        try {
			convert_data(url_name, url_list);
			// confirmしてから実行。yes出ない場合は何もしない
			if (confirm('更新しますか？')) {} else {
				return;
			}
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/pop_up_url/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
					id: id,
					uid: uid,
					url_name: convert_data_0,
					url_list: convert_data_1,
				})
            });
            const data = await response.json();
            console.log('Record updated:', data);
            fetch_data(); // Refresh the data
        } catch (error) {
            console.error('Error updating record:', error);
        }
    }

    async function delete_record(id) {
        try {
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/pop_up_url/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, uid })
            });
            const data = await response.json();
            console.log('Record deleted:', data);
            fetch_data(); // Refresh the data
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    onMount(() => {
		canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling on touch devices
            startDrawing(e.touches[0]);
        });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e.touches[0]);
        });

        check_login();
		fetch_data();
    });
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .content {
        display: flex;
        width: 100%;
    }
    .left-column, .right-column {
        flex: 1;
        padding: 10px;
    }
    textarea {
        width: 100%;
        height: 50vh;
    }
	canvas {
        border: 1px solid black;
    }
</style>

<div class="container">


<div class="header">
	<h1>{service_name}</h1>
	{#if user}
		<button on:click={sign_out}>Logout</button>
	{:else}
		<button on:click={google_login}>Login</button>
	{/if}
</div>
<div class="content">
	<div class="left-column server_side">
		<div class="console">
			{#if error_message}
			<button id="error_message" on:click={() => error_message = ''} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') error_message = ''; }} style="background: none; border: none; padding: 0; margin: 0; color: inherit; font: inherit; cursor: pointer;">
				{error_message}
			</button>
		{/if}
		<p>{login_result}</p>
		<p>{url_name}</p>
		{#if user}
		<button on:click={create_record}>Create Record</button>
		{/if}
		<p>uid: {uid}</p>
		</div>
		<div class="list">
		<ul>
			{#each web_data as item}
				<li>
					{item.url_name}
					<button on:click={() => url_list = item.url_list}>Load</button>
					<!-- ログアウト状態ではupdateとdeleteは非表示 -->
					{#if user}
					<button on:click={() => update_record(item.id)}>Update</button>
					<button on:click={() => delete_record(item.id)}>Delete</button>
					{/if}
				</li>
			{/each}
		</ul>
		</div>
	</div>


	<div class="right-column">

		<button on:click={exportImage}>Export</button>
<button on:click={undo}>Undo</button>
<canvas id="canvas" width="700vw" height="700vh"></canvas>

        </div>
</div>


</div>
