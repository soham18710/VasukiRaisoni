# Findly

Findly is a platform designed to help users recover their lost belongings using artistic QR codes and privacy-focused messaging.

## Problem Statement
Losing personal items such as water bottles, bags, or gadgets is a common problem. Traditional lost-and-found systems are inefficient, lack privacy, and often fail to connect finders with owners in a secure and user-friendly way.

## Proposed Solution
Findly enables users to generate unique, artistic QR codes for their belongings. These QR codes can be printed as stickers and attached to items. When someone finds a lost item, they can scan the QR code and send an anonymous message to the owner without logging in, ensuring privacy for both parties. Owners receive these messages in a spam section until they mark the item as "LOST". Once marked, messages are delivered to the main chat, facilitating direct communication to recover the item.

## Key Features
- **Artistic QR Codes:** Users can customize the appearance of their QR codes, making them visually appealing and unique.
- **Anonymous Messaging:** Finders can contact owners without creating an account, protecting their privacy.
- **Spam/Main Chat Segregation:** Messages from finders are initially sent to a spam section. Only when the owner marks the item as lost do messages move to the main chat.
- **Lost Item Management:** Owners can easily manage the status of their items and control how they receive messages.

## Use Case Examples
- **Water Bottle:** Attach a Findly QR sticker to your bottle. If lost, a finder scans the code and sends a message. You get notified and can coordinate its return.
- **Backpack:** Place a QR sticker on your bag. If misplaced, anyone who finds it can reach out anonymously, and you can mark it as lost to prioritize messages.
- **Gadgets:** Secure your devices with a QR code. If found, the finder can contact you without revealing their identity.

## Tech Stack Used

### Frontend
<p>
	<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="40" height="40"/>
	<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="40" height="40"/>
	<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" alt="Vite" width="40" height="40"/>
	<img src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" alt="Supabase" width="40" height="40"/>
</p>

- **React** (with TypeScript)
- **Vite** (for fast development and build)
- **Supabase** (for authentication and backend services)
- **Custom Hooks and Components**

### Backend
<p>
	<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="40" height="40"/>
	<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" width="40" height="40"/>
	<img src="https://img.icons8.com/ios-filled/50/000000/qr-code.png" alt="QR Code" width="40" height="40"/>
</p>

- **Python** (FastAPI or similar framework)
- **SQLite** (for database management)
- **QR Code Generation** (with artistic customization)

## Folder Structure
- `frontend/` — React app for user interface
- `backend/` — Python backend for API, QR code generation, and messaging

## Getting Started
1. Clone the repository.
2. Install dependencies for both frontend and backend.
3. Run the backend server.
4. Start the frontend development server.


## License
This project is licensed under the MIT License.
