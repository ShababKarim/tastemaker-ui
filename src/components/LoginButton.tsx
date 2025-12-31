'use client';

const LOGIN_MODAL_ID = 'login-modal';

export default function LoginButton() {
  return (
    <button
      onClick={() => (document.getElementById(LOGIN_MODAL_ID) as HTMLDialogElement)?.showModal()}
      className="btn btn-sm"
    >
      Log in
    </button>
  );
}
