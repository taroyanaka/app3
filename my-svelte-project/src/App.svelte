<script>
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////

    // base64Image => image_name
    // base64Image => base64Image
    let image_name = 'paint1';


    
    // let base64Image = `https://www.google.com
    // https://www.amazon.com
    // https://www.apple.com
    // https://www.microsoft.com
    // https://www.facebook.com`;
    
    let convert_data_0 = null;
    let convert_data_1 = null;
    // convert_dataの引数の初期値をimage_name, base64Imageに設定
    function convert_data(data_0 = image_name, data_1 = base64Image) {
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
                const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/read', {
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
                convert_data(image_name, base64Image);
                const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        uid: uid,
                        image_name: convert_data_0,
                        base64Image: convert_data_1,
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
                convert_data(image_name, base64Image);
                // confirmしてから実行。yes出ない場合は何もしない
                if (confirm('更新しますか？')) {} else {
                    return;
                }
                const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        uid: uid,
                        image_name: convert_data_0,
                        base64Image: convert_data_1,
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
                const response = await fetch('https://cotton-concrete-catsup.glitch.me/app5/delete', {
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
            // fetch_data();
        });
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    
    
    
        let canvas;
        let ctx;
        let drawing = false;
        let base64Image;
        let per = 0;
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
            updateBase64Image();
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

        function updateBase64Image() {
            base64Image = canvas.toDataURL('image/png');
            per = base64Image.length / 131072 * 100;
            
            if (base64Image.length > 131072) {
                alert('The image is too large. undo or rewrite the image.');
                return;
            }
        }
    
        function exportImage() {
            base64Image = canvas.toDataURL('image/png');
            // base64Imageが128kb以上の場合はalertを表示
            if (base64Image.length > 131072) {
                alert('The image is too large. Please reduce the size and try again.');
                return;
            }
            alert('Base64 Image Data URL has been saved to the global variable `base64Image`.');
            console.log(base64Image); // Optional: View the Base64 string in the console
            // base64Imageが128kbのうちの何%かを表示
            console.log(base64Image.length / 131072 * 100 + '%');
        }

        function load_image(base64Image) {
            const img = new Image();
            img.src = base64Image;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }

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
    canvas {
        border: 1px solid black;
    }
    /* textarea {
        width: 100%;
        height: 50vh;
    } */
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
		<p>{image_name}</p>
		{#if user}
		<button on:click={create_record}>Create Record</button>
		{/if}
		<p>uid: {uid}</p>
		</div>
		<div class="list">
		<ul>
			{#each web_data as item}
				<li>
					{item.image_name}
					<button on:click={() => load_image(item.base64Image)}>Load</button>
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
        <!-- {#if is_editing_image_name}
            <input type="text" bind:value={image_name} />
            <button on:click={service_update_image_name}>Update</button>
        {:else}
            <button on:click={service_toggle_edit_image_name}>Change List Name</button>
        {/if} -->
        <button on:click={undo}>Undo</button>
        <canvas bind:this={canvas} width="450vw" height="450vh"></canvas>
        <!-- perをプログレスバーで表示 -->
        <progress value={per} max="100"></progress>
        <button on:click={exportImage}>Export</button>
    </div>
</div>


</div>
