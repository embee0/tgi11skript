# Dies ist ein Makefile. Es wird verwendet, um die Erstellung des Buches 
# zu automatisieren und damit zu vereinfachen.
# Eine Anleitung zur Verwendung von Makefiles findet man z.B. unter
# https://www.jfranken.de/homepages/johannes/vortraege/make.de.html

# Dieses spezielle Makefile ist für die Verwendung mit dem Jupyter-Book
# optimiert. Die möglichen Befehle kann man mit `make help` anzeigen lassen.

# Konfigurationsvariablen - hier anpassen für andere Server/Pfade
PUBLISH_SERVER = mbqw
PUBLISH_PATH = html/tgi11buch

# Konfiguration für den lokalen Entwicklungsserver
DEV_PORT = 8011
BUILD_DIR = _build/html

# Phony targets (erzeugen keine Dateien mit diesen Namen)
.PHONY: all help clean build update develop kill publish status tag-notebooks

# Standardziel: Hilfetext anzeigen
all: help


# Startet den Jupyter-Book Server und beobachtet Änderungen, d.h.
# das Buch wird, sobald Änderungen gespeichert werden, neu gebaut
# und im Browser aktualisiert. Man muss nichts weiter tun!!!
develop:
	jupyter-book config sphinx .
	sphinx-autobuild . $(BUILD_DIR) -b html --port $(DEV_PORT) --open-browser --delay 0
	# usage: https://pypi.org/project/sphinx-autobuild/

kill:
	# Beendet den laufenden Server
	@echo "Beende sphinx-autobuild Server..."
	@pkill -f sphinx-autobuild || echo "Kein sphinx-autobuild Server gefunden"

# Zeigt den Status des Entwicklungsservers an
status:
	@echo "Überprüfe sphinx-autobuild Server Status..."
	@pgrep -f sphinx-autobuild > /dev/null && echo "Server läuft" || echo "Server läuft nicht"

# Löscht alle erzeugten Dateien und Verzeichnisse
clean:
	jupyter-book clean .

# Baut das Buch in HTML
build: 
	jupyter-book build . --all

# Baut das Buch in HTML aber ohne clean und nur geänderte Dateien 
update: 
	jupyter-book build .

# Buch online veröffentlichen
publish: update
	rsync -avz $(BUILD_DIR)/* $(PUBLISH_SERVER):$(PUBLISH_PATH)

tag-notebooks:
	python -m teachbook_utils.update_notebook_tags

# Hilfetext
help:
	@echo "Bitte benutze \`make <target>', wobei <target> eines der folgenden ist"
	@echo "  clean       um alle temporären Dateien und Verzeichnisse zu löschen"
	@echo "  build       um das Buch in HTML zu bauen"
	@echo "  update      um das Buch in HTML zu aktualisieren"
	@echo "  develop     um während des Schreibens einen lokalen Server zu starten und Änderungen sofort zu sehen"
	@echo "  kill        um den laufenden lokale Server zu beenden"
	@echo "  status      um den Status des Entwicklungsservers zu überprüfen"
	@echo "  publish     um das Buch online zu veröffentlichen."
	@echo "  tag-notebooks um Tags aus '# TAG:' Kommentaren in Notebooks zu übernehmen"
	@echo "  help        um diese Nachricht anzuzeigen"
