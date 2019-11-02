#!/bin/bash

set -e

cmd=$(basename $0)

sub_help(){
    echo "Usage: $cmd <subcommand> [options]"
    echo "Subcommands:"
    echo "    help              Show help"
    echo "    docker-build      Build docker images"
    echo "    docker-up         Run Docker-compose to start reactjs app"
    echo ""
    echo "For help with each subcommand run:"
    echo "$cmd <subcommand> -h|--help"
    echo ""
}

sub_clean() {
    module=''
    echo "Cleaning for all modules in project"
    _docker_mvn
    echo "DONE!"
}

sub_package() {
    module=''
    if [ -z $1 ]; then
        echo "Packaging for all modules in project"
    elif [ -n $1 ]; then
        module='-am -pl '$1
        echo "Packaging for module" $1
    fi
    _docker_mvn package $module -DskipTests
    echo "DONE!"
}

sub_docker-build() {
    # if [ -d 'commons/target' ]; then
    #     echo "Already packaged!"
    # else
    #     echo "Need to package before building with docker-compose.."
        # sub_package
    # fi

    docker-compose -p app -f docker-compose.yml build
}

sub_docker-up() {
    docker-compose -p app -f docker-compose.yml up
}

# TODO: Push Docker image to registry?

subcommand=$1

case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift
        sub_${subcommand} $@
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "Run '$cmd --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac

