const { invoke } = window.__TAURI__.tauri

document.addEventListener('DOMContentLoaded', async () => {
    const mapContainer = document.getElementById('map-container');
    const _map = document.getElementById('map');

    function draw_map(map) {
        if (map === null) { return }

        // Update the background image
        _map.src = "assets".concat(map.image);

        // Add new markers
        _map.onload = () => {
            // Clear existing markers
            const existingMarkers = document.querySelectorAll('.marker');
            existingMarkers.forEach(marker => marker.remove());

            map.markers.forEach(marker => {
                const new_marker = document.createElement('div');
                new_marker.classList.add('marker');
                new_marker.style.top = (marker.position.y / _map.naturalHeight) * 100 + "%"
                new_marker.style.left = (marker.position.x / _map.naturalWidth) * 100 + "%"
                const marker_image = document.createElement('div');
                marker_image.classList.add('marker-image');
                marker_image.style.backgroundImage = `url(assets${marker.image})`; // Set the background image
                marker_image.style.width = '60px'; // Image width
                marker_image.style.height = '60px'; // Image height

                new_marker.appendChild(marker_image);
                new_marker.addEventListener('click', () => {
                    handle_marker_click(marker.map_id.toString());
                });
                mapContainer.appendChild(new_marker);
            });

            const converter = new showdown.Converter();
            document.getElementById("informatic").innerHTML = converter.makeHtml(map.text)
        }
    }

    async function handle_marker_click(map_id) {
        await invoke('set_map', { id: map_id }).then((response) => {
            draw_map(response)
        }).catch((error) => {
            console.error(`Error updating markers: ${error}`);
        })
    }


    async function popMap() {
        await invoke('pop_map').then((response) => {
            draw_map(response)
        }).catch((error) => {
            console.error(`Error updating markers: ${error}`);
        })
    }

    handle_marker_click("0")

    document.addEventListener('keydown', (event) => {
        if (event.key === "Backspace") { popMap() }
    })
});