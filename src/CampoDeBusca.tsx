export default function CampoDeBusca({ valor, onChange, placeholder }: any) {
    return (
        <div className="CampoDeBusca-container">
            <span className="CampoDeBusca-icone"></span>
            <input
                className="CampoDeBusca-input"
                type="text"
                value={valor}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
