import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const API_URL = "http://127.0.0.1:8000/api/genes/";

function GeneCRUD() {
    const [genes, setGenes] = useState([]);
    const [formData, setFormData] = useState({ name: "", sequence: "" });
    const [file, setFile] = useState(null);
    const [gcContent, setGcContent] = useState(null);

    useEffect(() => {
        fetchGenes();
    }, []);

    const fetchGenes = async () => {
        try {
            const response = await axios.get(API_URL);
            setGenes(response.data);
        } catch (error) {
            console.error("Error fetching genes:", error);
        }
    };

    const createGene = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                await axios.post(API_URL, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            fetchGenes();
            setFormData({ name: "", sequence: "" });
        } catch (error) {
            console.error("Error creating gene:", error);
        }
    };

    const fetchGCContent = async (id) => {
        try {
            const response = await axios.get(`${API_URL}${id}/gc_content/`);
            setGcContent(response.data.gc_content);
        } catch (error) {
            console.error("Error fetching GC content:", error);
        }
    };

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createGene();
                }}
            >
                <input
                    type="text"
                    placeholder="Gene Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                />
                <textarea
                    placeholder="Gene Sequence"
                    value={formData.sequence}
                    onChange={(e) =>
                        setFormData({ ...formData, sequence: e.target.value })
                    }
                ></textarea>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">Add Gene</button>
            </form>
            <ul>
                {genes.map((gene) => (
                    <li key={gene.id}>
                        {gene.name}: {gene.sequence}{" "}
                        <button onClick={() => fetchGCContent(gene.id)}>
                            Get GC Content
                        </button>
                    </li>
                ))}
            </ul>
            {gcContent && <p>GC Content: {gcContent}%</p>}
            <Plot
                data={[
                    {
                        x: genes.map((g) => g.name),
                        y: genes.map((g) => g.sequence.length),
                        type: "bar",
                    },
                ]}
                layout={{ title: "Sequence Lengths" }}
            />
        </div>
    );
}

export default GeneCRUD;
