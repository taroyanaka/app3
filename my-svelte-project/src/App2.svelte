<script>
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
let url_name = 'paint1';

// let url_list = `https://www.google.com
// https://www.amazon.com
// https://www.apple.com
// https://www.microsoft.com
// https://www.facebook.com`;

let convert_data_0 = null;
let convert_data_1 = null;
// convert_dataの引数の初期値をurl_name, url_listに設定
function convert_data(data_0 = url_name, data_1 = base64Image) {
	convert_data_0 = data_0;
	convert_data_1 = data_1;
}
const service_name = 'Pop Up URL';

// pop_up_url => ez_draw





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
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/ez_draw/read', {
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
			convert_data(url_name, base64Image);
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/ez_draw/create', {
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
			convert_data(url_name, base64Image);
			// confirmしてから実行。yes出ない場合は何もしない
			if (confirm('更新しますか？')) {} else {
				return;
			}
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/ez_draw/update', {
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
            const response = await fetch('https://cotton-concrete-catsup.glitch.me/ez_draw/delete', {
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
        check_login();
		fetch_data();
    });
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////
/////////////////////////////server/////////////////////////////



    let canvas;
    let ctx;
    let drawing = false;
    let base64Image;
    const undoStack = [];

    onMount(() => {
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
    });

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
</script>

<style>
    canvas {
        border: 1px solid black;
    }
</style>

<button on:click={exportImage}>Export</button>
<button on:click={undo}>Undo</button>
<canvas bind:this={canvas} width="700vw" height="700vh"></canvas>

<!-- input url_name -->
<input type="text" bind:value={url_name} placeholder="URL Name" />

<!-- create_record -->