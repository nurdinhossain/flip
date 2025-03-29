export default function Login() {
    return (
        <div className="flex justify-center text-center absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <div className="flex flex-col basis-md h-screen justify-center">
                <h1 className="font-bold text-6xl text-white mb-2">flip.</h1>
                <h2 className="font-bold text-3xl text-white mb-10">The better way to dispose.</h2>

                {/* Login box */}
                <form className="border-2 border-solid rounded-sm p-4 bg-white text-xl">
                    {/* Title */}
                    <h2 className="underline text-2xl mb-6">Login</h2>

                    {/* User & Pass */}
                    <div className="bg-blue-50 text-left">
                        <label htmlFor="username" className="block font-bold mb-2">Username:</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="bg-blue-50 text-left">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Password" />
                    </div>

                    {/* Submit & Forgot password */}
                    <div className="flex items-center justify-between mt-6">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Sign In
                        </button>
                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
