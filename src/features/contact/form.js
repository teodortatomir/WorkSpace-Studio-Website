        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const statusDiv = document.getElementById('formStatus');
            const submitBtn = document.getElementById('submitBtn');
            const form = e.target;
            
            const nameInput = form.querySelector('input[name="name"]');
            const companyInput = form.querySelector('input[name="company"]');
            const emailInput = form.querySelector('input[name="email"]');
            const serviceInputs = form.querySelectorAll('input[name="services[]"]');
            const messageInput = form.querySelector('textarea[name="message"]');

            // Reset status
            statusDiv.style.display = 'none';
            statusDiv.offsetHeight; 
            statusDiv.className = 'form-status';

            let errorMessage = "";

            if (!nameInput.value.trim()) {
                errorMessage = "Please enter your full name.";
                nameInput.focus();
            } 
            else if (!companyInput.value.trim()) {
                errorMessage = "Please enter your company name.";
                companyInput.focus();
            }
            else if (!emailInput.value.trim()) {
                errorMessage = "An email address is required.";
                emailInput.focus();
            } 
            else if (!emailInput.checkValidity()) {
                errorMessage = "Please enter a valid email format.";
                emailInput.focus();
            }
            else if (!Array.from(serviceInputs).some(input => input.checked)) {
                errorMessage = "Please choose at least one service.";
                serviceInputs[0].focus();
            }
            else if (!messageInput.value.trim()) {
                errorMessage = "Please enter your message.";
                messageInput.focus();
            }

            if (errorMessage) {
                statusDiv.innerText = errorMessage;
                statusDiv.classList.add('error');
                statusDiv.style.display = 'block';
            } else {
                // MODIFICARE: Trimitere RealÄƒ prin AJAX (Fetch)
                const data = new FormData(form);
                
                // Feedback vizual: SchimbÄƒm textul butonului Ã®n timp ce trimite
                const originalBtnText = submitBtn.querySelector('span').innerText;
                submitBtn.querySelector('span').innerText = "Sending...";
                submitBtn.style.opacity = "0.7";
                submitBtn.disabled = true;

                fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    submitBtn.querySelector('span').innerText = originalBtnText;
                    submitBtn.style.opacity = "1";
                    submitBtn.disabled = false;

                    if (response.ok) {
                        statusDiv.innerText = 'Thank you! Your message has been sent directly to our team.';
                        statusDiv.classList.add('success');
                        statusDiv.style.display = 'block';
                        form.reset();
                    } else {
                        statusDiv.innerText = 'Oops! There was a problem. Please try again.';
                        statusDiv.classList.add('error');
                        statusDiv.style.display = 'block';
                    }
                }).catch(error => {
                    submitBtn.querySelector('span').innerText = originalBtnText;
                    submitBtn.style.opacity = "1";
                    submitBtn.disabled = false;
                    
                    statusDiv.innerText = 'Network error. Please check your connection.';
                    statusDiv.classList.add('error');
                    statusDiv.style.display = 'block';
                });
            }
        });
    