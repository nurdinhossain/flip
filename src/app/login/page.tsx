export default function Login() {
    return (
        <div className="flex justify-center text-center absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <div className="flex flex-col basis-md h-screen justify-center">
                <h1 className="font-bold text-6xl text-white mb-2">flip.</h1>
                <h2 className="font-bold text-3xl text-white mb-10">The better way to dispose.</h2>

                {/* Login box */}
                <form className="border-2 border-solid rounded-sm p-4 bg-white text-xl">
                    {/* Title */}
                    <h2 className="font-bold text-3xl mb-4">Login</h2>

                    {/* User & Pass */}
                    <div className="text-left mb-4">
                        <label htmlFor="username" className="block font-bold mb-2">Username:</label>
                        <input className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="text-left">
                        <label htmlFor="password" className="block font-bold mb-2">Password:</label>
                        <input className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" id="password" type="password" placeholder="Password" />
                    </div>

                    {/* Submit & Forgot password */}
                    <div className="flex items-center justify-between mt-6">
                        <button className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded focus:shadow-outline" type="button">
                            Sign In
                        </button>
                        <a className="inline-block align-baseline font-bold text-base text-gray-800 hover:text-black" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
